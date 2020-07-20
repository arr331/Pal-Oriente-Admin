import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
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
export class SiteComponent implements OnInit, OnChanges {
  siteForm: FormGroup;
  files: FileList;
  file: File;
  url: Observable<string>;

  @Input() municipality: any;
  @Input() site: any;
  @Input() update: any;

  fields = {
    name: 'Nombre del municipio',
    description: 'Descripción',
    image: 'Imagen',
    x: 'X',
    y: 'Y',
    //galery: 'Galeria'
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
      //galery: ['']
    });
    this.update && this.site ? this.fillform() : '';
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  fillform() {
    this.siteForm.get('name').setValue(this.site.name);
    this.siteForm.get('description').setValue(this.site.description);
    this.siteForm.get('image').setValue(this.site.image);
    this.siteForm.get('x').setValue(this.site.x);
    this.siteForm.get('y').setValue(this.site.y);
  }

  saveSite(){
    if(!this.update && this.siteForm.get('name').value){
      const site =  this.siteService.buildSite(this.siteForm.value, this.municipality);
      //this.files ?  this.siteService.uploadGalery(this.files) : '';
      this.siteService.uploadImg(this.url).then(answer => {
        site.image = answer;
        this.siteService.addSite(site, this.municipality);
        this.reset('Sitio Guardado');
      });
    } else if (this.update && this.site && this.siteForm.get('name').value) {
      this.site = this.siteService.updateSite(this.siteForm.value, this.site, this.municipality);
      this.files ? this.siteService.uploadGalery(this.files) : '';
      if (!this.url) {
        this.siteService.addSite(this.site, this.municipality);
        this.reset('Sitio Actualizado');
      } else {
        this.siteService.uploadImg(this.url).then(answer => {
          this.site.image = answer;
          this.siteService.addSite(this.site, this.municipality);
          this.reset('Sitio Actualizado');
        });
      }
    }
  }

  reset(msj) {
    console.log(msj);
    this.ngOnInit();
    this.url = null;
    this.files = null;
    $('#modalCreateSite').modal('hide');
  }

  clearSite() {
    this.siteForm.reset();
    $('#modalCreateSite').modal('hide');
  }

  uploadImage(img){
    this.url = img;
  }

  uploadGallery(imgs) {
    this.files = imgs.target.files
    console.log(this.files, 'carpeta');
    
  }
  // upload(img){
  //   this.file = img.target.files[0];    
  // }
  // importImages(imgs) {
  //   this.files = imgs.target.files
  // }
}
