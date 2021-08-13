import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Municipality } from 'src/app/interfaces/municipality';
import { Site } from 'src/app/interfaces/site';
import { GalleryService } from 'src/app/services/configuration/gallery.service';
import { SiteService } from 'src/app/services/configuration/site.service';
declare var $: any;

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnChanges {
  siteForm: FormGroup;
  siteList: Site[];
  site: Site;
  images: string[] = [];
  url: any;
  loading: boolean;
  @Input() municipality: Municipality;

  constructor(
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private galleryService: GalleryService
  ) { }

  ngOnChanges(): void {
    this.siteList = [];
    if (this.municipality.sites) {
      Object.keys(this.municipality.sites).forEach((m) =>
        this.siteList.push(this.municipality.sites[m])
      );
    }
    this.buildForm();
  }

  buildForm(): void {
    this.siteForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      x: ['', Validators.required],
      y: ['', Validators.required],
      reference: [''],
      state: [true],
    });
  }

  newSite(site: Site): void {
    this.site = site;
    site ? this.siteForm.patchValue(site) : this.buildForm();
    $('#siteModal').modal('show');
  }

  addImages(files: FileList): void {
    for (let index = 0; index < files.length; index++) {
      const reader = new FileReader();
      reader.onload = (event) =>
        this.images.push(event.target.result.toString());
      reader.readAsDataURL(files[index]);
    }
  }

  saveGallery(): void {
    this.loading = true;
    this.galleryService
      .uploadGalery(
        this.images,
        this.municipality.idMun,
        this.site.idSite,
        'SITES'
      )
      .then(() => {
        this.loading = false;
        $('#galleryModal').modal('hide');
      });
  }

  saveSite(): void {
    this.loading = true;
    if (this.siteForm.valid) {
      const site = this.siteService.buildSite(
        this.siteForm.value,
        this.municipality.idMun,
        this.site ? this.site.idSite : ''
      );
      if (this.url) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgToSave = event.target.result;
          this.siteService.uploadImg(imgToSave).then((answer) => {
            site.image = answer;
            this.siteService.addSite(site);
            this.reset(site);
          });
        };
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.siteService.addSite(site);
        this.reset(site);
      }
    } else {
      alert('Por favor llenar todos los campos para continuar');
    }
  }

  reset(site): void {
    this.loading = false;
    $('#siteModal').modal('hide');
    this.buildForm();
    this.site
      ? (this.siteList[this.siteList.indexOf(this.site)] = site)
      : this.siteList.push(site);
    this.url = null;
  }

  openGallery(site: Site): void {
    this.loading = true;
    this.site = site;
    this.images = [];
    this.galleryService
      .getAllImages(this.municipality.idMun, site.idSite, 'SITES')
      .then((result) => {
        result.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then((url) => this.images.push(url));
          this.loading = false;
          $('#galleryModal').modal('show');
        }
        );
      });
  }
}
