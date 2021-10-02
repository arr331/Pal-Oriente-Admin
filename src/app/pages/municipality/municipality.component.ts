import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Municipality } from 'src/app/interfaces/municipality';
import { MunicipalityService } from 'src/app/services/configuration/municipality.service';
import { Breadcrumb, BreadPaths } from 'src/app/utils/breadcrumb';
import { FormValidator } from 'src/app/utils/form-validator';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.scss'],
})
export class MunicipalityComponent implements OnInit {
  municipalityForm: FormGroup;
  listMunicipalities: Municipality[];
  municipality: Municipality;
  isNew = true;
  url: any;
  imageBlob: any;
  item: string;
  loading: boolean;
  region: string;
  regionName: string;
  image: string;
  fields = {
    name: 'nombre',
    description: 'descripción',
    economy: 'economía',
    habitants: 'habitantes',
    history: 'historia',
    weather: 'clima',
    x: 'coordenada X',
    y: 'coordenada Y'
  };

  constructor(
    private formBuilder: FormBuilder,
    private municipalityService: MunicipalityService,
    private imageCompress: NgxImageCompressService,
    private router: Router
  ) {
    Breadcrumb.paths.next(BreadPaths.municipality);
  }

  ngOnInit(): void {
    this.region = sessionStorage.getItem('region');
    this.regionName = sessionStorage.getItem('regionName');
    if (this.region) {
      this.loading = true;
      this.municipalityService
        .getMunicipios(this.region)
        .valueChanges()
        .subscribe(answer => {
          this.listMunicipalities = answer;
          this.loading = false;
        }, error => {
          this.throwError('La información no pudo ser obtenida, inténtelo de nuevo más tarde', error);
        });
    } else {
      Swal.fire({
        title: 'Advertencia',
        html: 'Debe seleccionar una región',
        confirmButtonText: `Ir a regiones`,
        icon: 'warning'
      }).then(() => {
        this.router.navigate(['regiones']);
      });
    }
    this.buildForm();
  }

  buildForm(): void {
    this.municipalityForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      economy: ['', Validators.required],
      habitants: ['', Validators.required],
      history: ['', Validators.required],
      weather: ['', Validators.required],
      image: [''],
      reference: [''],
      state: [true],
      x: ['', Validators.required],
      y: ['', Validators.required]
    });
  }

  newMun(isNew: boolean, mpio?: Municipality): void {
    this.item = '';
    this.isNew = isNew;
    this.municipality = mpio;
    this.url = null;
    if (mpio) {
      this.municipalityForm.patchValue(mpio);
      this.image = mpio.image;
    } else {
      this.buildForm();
      this.image = '';
    }
    $('#mpioModal').modal('show');
  }

  showConfiguration(mpio: Municipality, item: string): void {
    sessionStorage.setItem('idMun', mpio.idMun);
    sessionStorage.setItem('municipalityName', mpio.name);
    if (item === 'site') {
      sessionStorage.setItem('sites', JSON.stringify(mpio.sites));
      this.router.navigateByUrl('/sitios');
    } else {
      sessionStorage.setItem('celebrations', JSON.stringify(mpio.celebrations));
      this.router.navigateByUrl('/celebraciones');
    }
  }

  async saveMpio(): Promise<void> {
    if (FormValidator.validateForm(this.municipalityForm) && this.image) {
      if (!this.isNew || this.validateName()) {
        this.loading = true;
        const mpio = this.municipalityService.buildMunicipality(
          this.municipalityForm.value,
          this.isNew ? '' : this.municipality.idMun
        );
        if (this.url) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            await this.compressFile(event.target.result);
            this.municipalityService.uploadImg(this.region, this.imageBlob).then((answer) => {
              mpio.image = answer;
              this.municipalityService.saveMunicipality(this.region, mpio);
              Swal.fire('Buen trabajo!', 'Municipio creado exitosamente', 'success');
              this.reset('Municipio creado');
            }).catch((error) => {
              this.throwError('El municipio no pudo guardarse, inténtelo de nuevo más tarde', error);
            });
          };
          reader.readAsDataURL(this.url);
        } else {
          this.municipalityService.saveMunicipality(this.region, mpio).then(() => {
            this.reset('Municipio Actualizado');
            Swal.fire('¡Buen trabajo!', 'Municipio actualizado exitosamente', 'success');
          }).catch((error) => {
            this.throwError('El municipio no pudo actualizarse, inténtelo de nuevo más tarde', error);
          });
        }
      } else {
        Swal.fire('Atención', `Ya existe una municipio con el mismo nombre`, 'info');
      }
    } else {
      const imageRequerid = this.image ? '' : ', imagen';
      const invalids = `${FormValidator.msgInvalidKeys(this.fields, FormValidator.getInvalids(this.municipalityForm))}${imageRequerid}`;
      Swal.fire('Atención', `Los siguientes campos son inválidos: <br> <strong>${invalids}</strong>`, 'info');
    }
  }

  validateName(): boolean {
    const name: string = this.municipalityForm.get('name').value;
    return !this.listMunicipalities.some(mun => mun.name.trim().toLowerCase() === name.trim().toLowerCase());
  }

  readImage(file: File): void {
    this.url = file;
    const reader = new FileReader();
    reader.onload = (event) => (this.image = event.target.result.toString());
    reader.readAsDataURL(file);
  }

  throwError(msj: string, err: any): void {
    console.error(err);
    Swal.fire('Problema interno del servidor', msj, 'warning');
    this.loading = false;
  }

  reset(msj?: string): void {
    this.url = this.imageBlob = null;
    this.image = '';
    $('#mpioModal').modal('hide');
    this.buildForm();
    this.loading = false;
  }

  async compressFile(image): Promise<void> {
    this.imageBlob = this.dataURItoBlob(
      (await this.imageCompress.compressFile(image, -1, 50, 50)).split(',')[1]
    );
  }

  dataURItoBlob(dataURI): Blob {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
}
