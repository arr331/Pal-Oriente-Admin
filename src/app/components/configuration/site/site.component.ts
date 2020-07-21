import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SiteService } from 'src/app/services/site.service';
import { NgxImageCompressService } from 'ngx-image-compress';
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
  url: any;
  imageBlob: any;

  @Input() mpioId: any;

  constructor(private formBuilder: FormBuilder, private siteService: SiteService, private imageCompress: NgxImageCompressService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.siteForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
      x: [''],
      y: [''],
      state: [true]
    });
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  saveSite() {
    if (this.siteForm.valid) {
      const site = this.siteService.buildSite(this.siteForm.value, this.mpioId, '');
      if (this.url) {
        var reader = new FileReader();
        reader.onload = async event => {
          await this.compressFile(event.target.result);
          this.siteService.uploadImg(this.imageBlob).then(answer => {
            site.image = answer;
            this.siteService.addSite(site);
            this.reset('Municipio creado')
          });
        }
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.siteService.addSite(site);
        this.reset('Municipio Actualizado');
      }
    } else {
      console.log('llenar');
    }
  }

  reset(msj) {
    console.log(msj);
    this.buildForm();
    this.url = null;
    this.files = null;
    $('#modalCreateSite').modal('hide');
  }

  uploadGallery(imgs) {
    this.files = imgs.target.files
    console.log(this.files, 'carpeta');
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
}
