import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
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
  listMunicipalities: Array<any> = [];
  municipality;
  listSitios: Array<any> = [];
  update = false;
  municipalityForm: FormGroup;
  url: any;
  imageBlob: any;
  localUrl;
  site: any;
  editSite = false;


  constructor(private formBuilder: FormBuilder, private municipalityService: MunicipalityService,
    private dateService: DataServiceService, private imageCompress: NgxImageCompressService, private router: Router) { }

  ngOnInit(): void {
    this.dateService.getMunicipalities().valueChanges().subscribe((answer) => {
      this.listMunicipalities = answer;
    });

    this.municipalityForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
    });

  }
  showInfo(mpio) {
    this.municipality = mpio;
    this.listSites(mpio);
    $('#modal').modal('show');
  }

  listSites(mpio) {
    this.listSitios = [];
    Object.keys(mpio.info).forEach((m) => {
      this.listSitios.push(this.municipality.info[m]);
    });
  }

  newMun() {
    this.update = false;
    $('#modalCreate').modal('show');
  }

  async saveMpio() {
    if (!this.update && this.municipalityForm.get('name').value) {
        var reader = new FileReader();
        reader.onload = async event => {
          await this.compressFile(event.target.result);    
          const mpio = this.municipalityService.buildMunicipality(this.municipalityForm.value);
          this.municipalityService.uploadImg(this.imageBlob).then(answer => {
            mpio.image = answer;
            this.municipalityService.addMunicipality(mpio);
            this.reset('Municipio creado')
          });      
        }
        reader.readAsDataURL(this.url.target.files[0]); 
    } else if (this.update && this.municipalityForm.get('name').value) {
      this.municipality = this.municipalityService.updateMunicipality(this.municipalityForm.value, this.municipality);
      if (!this.url) {
        this.municipalityService.update(this.municipality);
        this.reset('Municipio Actualizado');
      } else {
        var reader  = new FileReader();
        reader.onload = async event => {
          await this.compressFile(event.target.result);
          this.municipalityService.uploadImg(this.imageBlob).then(answer => {
            this.municipality.image = answer; 
            this.municipalityService.update(this.municipality)
            this.reset('Municipio Actualizado');
          });
        }
        reader.readAsDataURL(this.url.target.files[0]); 
      }
    }
  }


  upload(img) {
    this.url = img;
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

  reset(msj) {
    console.log(msj);
    this.ngOnInit();
    this.url = null;
    this.imageBlob = null;
    $('#modalCreate').modal('hide');
  }

  clearMpio() {
    this.municipalityForm.reset();
  }

  updateMun(mpio) {
    this.update = true;
    this.municipality = mpio;
    this.fillForm();
    $('#modalCreate').modal('show');
  }

  fillForm() {
    this.municipalityForm.get('name').setValue(this.municipality.name);
    this.municipalityForm.get('description').setValue(this.municipality.description);
    this.municipalityForm.get('image').setValue(this.municipality.image);
  }

  addSite() {
    $('#modalCreate').modal('hide');
    this.municipalityForm.reset();
    $('#modalCreateSite').modal('show');
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
    this.clearMpio();
  }

  usersManager(){
    this.router.navigate(['/administration/users']);
  }
}
