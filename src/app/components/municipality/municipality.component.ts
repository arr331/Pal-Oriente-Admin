import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MunicipalityService } from 'src/app/services/municipality.service';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.scss']
})
export class MunicipalityComponent implements OnInit, OnChanges {
  municipalityForm: FormGroup;
  url: any;
  site: any;
  editSite = false;
  @Input() municipality: any;
  @Input() update: any;
  @Input() sites: any;

  fields = {
    name: 'Nombre del mucnicipio',
    description: 'Descripción',
    image: 'Imagen',
  };

  constructor(private formBuilder: FormBuilder, private municipalityService: MunicipalityService) { }

  ngOnInit(): void {
    console.log(this.sites, 'sitios in list in mun');
    
    this.municipalityForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
    });
    if (this.update && this.municipality){
      this.fillForm();
    }
  }
  ngOnChanges(): void {
    this.ngOnInit();
  }

  fillForm() {
    this.municipalityForm.get('name').setValue(this.municipality.name);
    this.municipalityForm.get('description').setValue(this.municipality.description);
    this.municipalityForm.get('image').setValue(this.municipality.image);
  }

  saveMpio() {
    if (!this.update && this.municipalityForm.get('name').value) {
      const mpio = this.municipalityService.buildMunicipality(this.municipalityForm.value);
      this.municipalityService.uploadImg(this.url).then(answer =>{
        mpio.image = answer;
        this.municipalityService.addMunicipality(mpio);
        this.reset('Municipio Guardado')
      });
    } else if (this.update && this.municipality && this.municipalityForm.get('name').value) {
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
  
  reset(msj) {
    console.log(msj);
    this.ngOnInit();
    this.url = null;
    $('#modalCreate').modal('hide');
  }

  updateSite(site){
    this.site = site;
    this.editSite = true;
    $('#modalSites').modal('hide');
    $('#modalCreateSite').modal('show');
  }

  clearMpio() {
    this.municipalityForm.reset();
  }

  upload(img){
    this.url = img
  }
}
