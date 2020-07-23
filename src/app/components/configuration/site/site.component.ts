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
  listSites: Array<any> = [];
  site: any;
  files: FileList;
  file: File;
  url: any;
  imageBlob: any;

  @Input() municipality: any;

  constructor(private formBuilder: FormBuilder, private siteService: SiteService, private imageCompress: NgxImageCompressService) { }

  ngOnInit() {
    this.listSites = [];
    Object.keys(this.municipality.sites).forEach((m) => {
      this.listSites.push(this.municipality.sites[m]);
    });
    this.buildForm();
  }

  ngOnChanges() {
    this.ngOnInit();
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
    site ? this.siteForm.setValue({
      name: site.name, description: site.description, image: site.image, x: site.x, y: site.y, state: site.state
    }) : this.buildForm();
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
    this.site ? this.listSites[this.listSites.indexOf(this.site)] = site : this.listSites.push(site);
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
