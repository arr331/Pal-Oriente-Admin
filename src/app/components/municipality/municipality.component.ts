import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MunicipalityService } from 'src/app/services/municipality.service';
import { DataServiceService } from 'src/app/services/data-service.service';
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
  fields = {
    name: 'Nombre del mucnicipio',
    description: 'Descripción',
    image: 'Imagen',
  };


  site: any;
  editSite = false;

  constructor(private formBuilder: FormBuilder, private municipalityService: MunicipalityService,
              private dateService: DataServiceService) { }

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
  showInfo(mpio){
    this.municipality = mpio;
    this.listSites(mpio);

    $('#modal').modal('show');
  }

  listSites(mpio){
    this.listSitios = [];
    Object.keys(mpio.info).forEach((m) => {
      this.listSitios.push(this.municipality.info[m]);
    });
  }

  newMun(){
    this.update = false;
    $('#modalCreate').modal('show');
  }

  saveMpio(){
    if (!this.update && this.municipalityForm.get('name').value) {
          const mpio = this.municipalityService.buildMunicipality(this.municipalityForm.value);
          this.municipalityService.uploadImg(this.url).then(answer =>{
            mpio.image = answer;
            this.municipalityService.addMunicipality(mpio);
            this.reset('Municipio Guardado')
          });
    }  else if (this.update && this.municipalityForm.get('name').value) {
          this.municipality = this.municipalityService.updateMunicipality(this.municipalityForm.value, this.municipality);
          if (!this.url) {
            this.municipalityService.update(this.municipality);
            this.reset('Municipio Actualizado');
          } else {
            this.municipalityService.uploadImg(this.url).then(answer => {
              this.municipality.image = answer;
              this.municipalityService.update(this.municipality)
              this.reset('Municipio Actualizado');
            })
          }
        }
  }

  upload(img){
    this.url = img
  }
  reset(msj) {
    console.log(msj);
    this.ngOnInit();
    this.url = null;
    $('#modalCreate').modal('hide');
  }

  clearMpio() {
    this.municipalityForm.reset();
  }

  updateMun(mpio){
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

  addSite(){
    $('#modalCreate').modal('hide');
    this.municipalityForm.reset();
    $('#modalCreateSite').modal('show');
  }

  deleteMun(mpio){

  }
  showSites(){
    this.listSites(this.municipality);
    $('#modalSites').modal('show');
  }

  updateSite(site){
    this.site = site;
    this.editSite = true;
    $('#modalCreate').modal('hide');
    $('#modalSites').modal('hide');
    $('#modalCreateSite').modal('show');
    this.clearMpio();
  }
}
