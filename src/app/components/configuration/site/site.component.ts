import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Municipality } from 'src/app/interfaces/municipality';
import { Site } from 'src/app/interfaces/site';
import { SiteService } from 'src/app/services/configuration/site.service';
declare var $: any;

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnChanges {
  siteForm: FormGroup;
  siteList: Site[];
  site: Site;
  files: FileList;
  file: File;
  url: any;
  imageBlob: any;
  @Input() municipality: Municipality;

  constructor(private formBuilder: FormBuilder, private siteService: SiteService, private imageCompress: NgxImageCompressService) { }

  ngOnChanges() {
    this.siteList = [];
    this.municipality.sites ? Object.keys(this.municipality.sites).forEach(m => this.siteList.push(this.municipality.sites[m])) : '';
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

  newSite(site) {
    this.site = site;
    site ? this.siteForm.patchValue(site) : this.buildForm();
    $('#siteModal').modal('show');
  }

  saveSite() {
    if (this.siteForm.valid) {
      const site = this.siteService.buildSite(this.siteForm.value, this.municipality.idMun, this.site ? this.site.idSite : '');
      if (this.url) {
        var reader = new FileReader();
        reader.onload = async event => {
          await this.compressFile(event.target.result);
          this.siteService.uploadImg(this.imageBlob).then(answer => {
            site.image = answer;
            this.siteService.addSite(site);
            this.reset(site)
          });
        }
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.siteService.addSite(site);
        this.reset(site);
      }
    } else {
      console.log('llenar');
    }
  }

  reset(site) {
    $('#siteModal').modal('hide');
    this.buildForm();
    this.site ? this.siteList[this.siteList.indexOf(this.site)] = site : this.siteList.push(site);
    this.url = null;
    this.files = null;
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

  // var sorage = this.storage.storage;
  // var storageRef = sorage.ref('Z');

  // storageRef.listAll().then(result => {
  //   result.items.forEach(itemRef => {
  //     itemRef.getDownloadURL().then((url) => {
  //       console.log(url, 'todas url');
  //     });

  //     // All the items under listRef.
  //   });
  // })
}
