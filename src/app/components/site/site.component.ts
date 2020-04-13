import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { SiteService } from 'src/app/services/site.service';
declare var $: any;

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {
  siteForm: FormGroup;
  files: FileList;
  url: Observable<string>;

  @Output() newSite = new EventEmitter<any>();
  @Output() images = new EventEmitter<any>();

  fields = {
    name: 'Nombre del mucnicipio',
    description: 'Descripción',
    image: 'Imagen',
    x: 'X',
    y: 'Y',
    galery: 'Galeria'
  };

  constructor(private formBuilder: FormBuilder, private storage: AngularFireStorage,
              private siteService: SiteService) { }

  ngOnInit(): void {
    this.siteForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
      x: [''],
      y: [''],
      galery: ['']
    });
  }

  createSite(){
    if(this.siteForm.get('name').value){
      const site =  this.siteService.buildSite(this.siteForm.value);
      this.newSite.emit(site);
      this.images.emit(this.files)
      $('#modalCreateSite').modal('hide');
    }
  }

  clearSite() {
    this.siteForm.reset();
    $('#modalCreateSite').modal('hide');
  }
 
  importImages(imgs) {
    this.files = imgs.target.files
    console.log(this.files, 'los files');
  }
  
  async upload(img){
    this.url = await  this.siteService.uploadImg(img);
    console.log(this.url, 'la url del porada sitio');
    
    this.siteForm.get('image').setValue(this.url);
  }
}
