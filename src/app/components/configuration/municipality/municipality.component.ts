import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MunicipalityService } from 'src/app/services/municipality.service';
import { DataServiceService } from 'src/app/services/data-service.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.scss']
})
export class MunicipalityComponent implements OnInit {
  municipalityForm: FormGroup;
  listMunicipalities: Array<any> = [];
  listSitios: Array<any> = [];
  municipality;
  isNew= true;
  url: any;
  imageBlob: any;
  localUrl;
  site: any;
  celebration: any;
  editCelebration = false;
  editSite = false;


  constructor(private formBuilder: FormBuilder, private municipalityService: MunicipalityService,
    private dateService: DataServiceService, private imageCompress: NgxImageCompressService, private router: Router) { }

  ngOnInit(): void {
    this.dateService.getMunicipios().valueChanges().subscribe((answer) => {
      this.listMunicipalities = answer;
    });
    this.buildForm();
  }

  buildForm() {
    this.municipalityForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      economy: [''],
      habitants: [''],
      history: [''],
      weather: [''],
      image: [''],
      state: [true]
    });
  }

  showInfo(mpio) {
    this.municipality = mpio;
    mpio.sites ? this.listSites(mpio) : '';
    $('#modal').modal('show');
  }

  listSites(mpio) {
    this.listSitios = [];
    Object.keys(mpio.sites).forEach((m) => {
      this.listSitios.push(this.municipality.sites[m]);
    });
  }

  newMun(isNew, mpio) {
    this.isNew = isNew;
    this.municipality = mpio;
    mpio ? this.municipalityForm.setValue({
      name: mpio.name, description: mpio.description, economy: mpio.economy, habitants: mpio.habitants,
      history: mpio.history, weather: mpio.weather, image: mpio.image, state: mpio.state
    }) : this.buildForm();
    $('#modalCreate').modal('show');
  }

  async saveMpio() {
    if (this.municipalityForm.valid) {
      const mpio = this.municipalityService.buildMunicipality(this.municipalityForm.value, this.isNew ? '' : this.municipality.idMun);
      if (this.url) {
        var reader = new FileReader();
        reader.onload = async event => {
          await this.compressFile(event.target.result);
          this.municipalityService.uploadImg(this.imageBlob).then(answer => {
            mpio.image = answer;
            this.municipalityService.saveMunicipality(mpio);
            this.reset('Municipio creado')
          });
        }
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.municipalityService.saveMunicipality(mpio);
        this.reset('Municipio Actualizado');
      }
    } else {
      console.log('llenar');
    }
  }

  reset(msj) {
    this.url = null;
    this.imageBlob = null;
    $('#modalCreate').modal('hide');
    this.buildForm();
  }

  async compressFile(image) {
    this.imageBlob = this.dataURItoBlob((await this.imageCompress.compressFile(image, -1, 50, 50)).split(',')[1]);
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  addSite() {
    $('#modalCreate').modal('hide');
    console.log('ENTRE A SITIOS');
    this.municipalityForm.reset();
    $('#modalCreateSite').modal('show');
  }

  addCelebration() {
    $('#modalCreate').modal('hide');
    console.log('ENTRE A CELEBRACIONES');
    this.municipalityForm.reset();
    $('#modalCreateCelebration').modal('show');
  }

  showSites() {
    this.listSites(this.municipality);
    $('#modalSites').modal('show');
  }

  updateSite(site) {
    this.site = site;
    this.editSite = true;
    $('#modalCreate').modal('hide');
    $('#modalSites').modal('hide');
    $('#modalCreateSite').modal('show');
  }

  usersManager() {
    this.router.navigate(['/administration/users']);
  }
}
