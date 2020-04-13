import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MunicipalityService } from 'src/app/services/municipality.service';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.scss']
})
export class MunicipalityComponent implements OnInit {
  municipalityForm: FormGroup;
  url: Observable<string>;
  site: any;
  images: any;

  fields = {
    name: 'Nombre del mucnicipio',
    description: 'Descripción',
    image: 'Imagen',
  };

  constructor(private formBuilder: FormBuilder, private municipalityService: MunicipalityService) { }

  ngOnInit(): void {
    this.municipalityForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
    });
  }

  newMpio() {
    if (this.municipalityForm.get('name').value && this.municipalityForm.get('image').value) {
      const mpio = this.municipalityService.buildMunicipality(this.municipalityForm.value);
      this.municipalityService.addMunicipality(mpio, this.site);
      if(this.images.length != 0 && this.site){
        this.sendImages();
      }
      this.ngOnInit();
      console.log('creado');
      
      $('#modalCreate').modal('hide');
    }
  }

  receivedImages(images){
    this.images = images;
    console.log(this.images, 'img in muni');
  }

  receivedSite(site){
    this.site = site;
    console.log(this.site, 'site in muni');
  }

  clearMpio() {
    this.municipalityForm.reset();
  }

  sendImages(){
    this.municipalityService.uploadGalery(this.images, this.site.galery);
  }

  async upload(img){
    this.url = await  this.municipalityService.uploadImg(img);
    this.municipalityForm.get('image').setValue(this.url);
  }
}
