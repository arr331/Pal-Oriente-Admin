import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Municipality } from 'src/app/interfaces/municipality';
import { MunicipalityService } from 'src/app/services/configuration/municipality.service';
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

  constructor(
    private formBuilder: FormBuilder,
    private municipalityService: MunicipalityService,
    private imageCompress: NgxImageCompressService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.municipalityService
    .getMunicipios()
    .valueChanges()
    .subscribe(answer => {
      this.listMunicipalities = answer;
      this.loading = false;
      
      }), error =>{
        console.log(error);
        this.throwError('La información no pudo ser obtenida, intentelo de nuevo más tarde');
      };
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
      reference: ['', Validators.required],
      state: [true],
    });
  }

  newMun(isNew: boolean, mpio): void {
    this.item = '';
    this.isNew = isNew;
    this.municipality = mpio;
    mpio ? this.municipalityForm.patchValue(mpio) : this.buildForm();
    $('#mpioModal').modal('show');
  }

  showConfiguration(mpio: Municipality, item: string): void {
    sessionStorage.setItem('idMun', mpio.idMun);
    if (item === 'site') {
      sessionStorage.setItem('sites', JSON.stringify(mpio.sites));
      this.router.navigateByUrl('/sitios');
    } else {
      sessionStorage.setItem('celebrations', JSON.stringify(mpio.celebrations));
      this.router.navigateByUrl('/celebraciones');
    }
  }

  async saveMpio(): Promise<void> {
    if (this.municipalityForm.valid) {
      this.loading = true;
      const mpio = this.municipalityService.buildMunicipality(
        this.municipalityForm.value,
        this.isNew ? '' : this.municipality.idMun
      );
      if (this.url) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          await this.compressFile(event.target.result);
          this.municipalityService.uploadImg(this.imageBlob).then((answer) => {
            mpio.image = answer;
            this.municipalityService.saveMunicipality(mpio);
            Swal.fire('Buen trabajo!','Municipio creado exitosamente','success');
            this.reset('Municipio creado');
          }).catch (()=>{
            this.throwError('El municipio no pudo guardarse, intentelo de nuevo más tarde');
          });
        };
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.municipalityService.saveMunicipality(mpio).then(() => {
          this.reset('Municipio Actualizado');
          Swal.fire('Buen trabajo!','Municipio actualizado exitosamente','success');
        }).catch (()=>{
          this.throwError('El municipio no pudo actualizarse, intentelo de nuevo más tarde');
        });
      }
    } else {
      Swal.fire('Campos incompletos','Por favor llenar todos los campos para continuar','warning');
    }
  }

  throwError(msj?: string): void{
    console.error('Problema interno del server');
    Swal.fire('Problema interno del server',msj,'warning');
    this.loading = false;
  }

  reset(msj?: string): void {
    this.url = null;
    this.imageBlob = null;
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
