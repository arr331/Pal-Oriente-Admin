import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Site } from 'src/app/interfaces/site';
import { GalleryService } from 'src/app/services/configuration/gallery.service';
import { SiteService } from 'src/app/services/configuration/site.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormValidator } from 'src/app/utils/form-validator';
import { Breadcrumb, BreadPaths } from 'src/app/utils/breadcrumb';
declare const $: any;

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})
export class SiteComponent implements OnInit {
  siteForm: FormGroup;
  site: Site;
  images: string[] = [];
  url: any;
  loading: boolean;
  idMun: string;
  municipalityName: string;
  regionName: string;
  siteList: Site[] = [];
  region: string;
  image: string;
  fields = {
    name: 'nombre',
    description: 'descripción',
    x: 'coordenada X',
    y: 'coordenada Y'
  }

  constructor(
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private galleryService: GalleryService,
    private router: Router,
  ) {
    Breadcrumb.paths.next(BreadPaths.sites);
  }

  ngOnInit(): void {
    this.idMun = sessionStorage.getItem('idMun');
    this.region = sessionStorage.getItem('region');
    this.regionName = sessionStorage.getItem('regionName');
    this.municipalityName = sessionStorage.getItem('municipalityName');
    if (this.idMun && this.region) {
      const sites = sessionStorage.getItem('sites') !== 'undefined' ? JSON.parse(sessionStorage.getItem('sites')) : undefined;
      if (sites) {
        Object.keys(sites).forEach((m) => this.siteList.push(sites[m]));
      } else { this.siteList = undefined }
    } else {
      Swal.fire({
        title: 'Advertencia',
        html: 'Debe seleccionar un municipio',
        confirmButtonText: `Ir a municipios`,
        icon: 'warning'
      }).then(() => {
        this.router.navigate(['municipios']);
      });
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
    this.url = null;
    if (site) {
      this.siteForm.patchValue(site);
      this.image = site.image;
    } else {
      this.buildForm();
      this.image = '';
    }
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
        this.region,
        this.images,
        this.idMun,
        this.site.idSite,
        'SITES'
      )
      .then(() => {
        this.loading = false;
        $('#galleryModal').modal('hide');
      }).catch((error) => {
        this.throwError('En este momento no se puede actualizar la galería, intentelo más tarde', error);
      });
  }

  saveSite(): void {
    if (FormValidator.validateForm(this.siteForm) && this.image) {
     if (this.site || this.validateName()) {
      this.loading = true;
      const site = this.siteService.buildSite(
        this.siteForm.value,
        this.idMun,
        this.site ? this.site.idSite : ''
      );
      if (this.url) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgToSave = event.target.result;
          this.siteService.uploadImg(this.region, imgToSave).then((answer) => {
            site.image = answer;
            this.siteService.addSite(this.region, site);
            this.reset(site);
          }).catch((error) => {
            this.throwError('No se pudo guardar el sitio, intentelo más tarde', error);
          });
        };
        reader.readAsDataURL(this.url);
      } else {
        this.siteService.addSite(this.region, site);
        this.reset(site);
      }
     } else {
      Swal.fire('Atención', `Ya existe un sitio con el mismo nombre`, 'info');
     }
    } else {
      const imageRequerid = this.image ? '' : ', imagen'
      const invalids = `${FormValidator.msgInvalidKeys(this.fields, FormValidator.getInvalids(this.siteForm))}${imageRequerid}`;
      Swal.fire('Atención', `Los siguientes campos son inválidos: <br> <strong>${invalids}</strong>`, 'info');
    }
  }

  validateName(): boolean {
    const name: string = this.siteForm.get('name').value;
    return !this.siteList.some(site => site.name.trim().toLowerCase() === name.trim().toLowerCase());
  }


  readImage(file: File): void {
    this.url = file;
    const reader = new FileReader();
    reader.onload = (event) => (this.image = event.target.result.toString());
    reader.readAsDataURL(file);
  }

  throwError(msj: string, err: any): void {
    console.error(err);
    Swal.fire('Problema interno del servidor', msj, 'warning');
    this.loading = false;
  }

  reset(site): void {
    this.loading = false;
    this.image = '';
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
      .getAllImages(this.region, this.idMun, site.idSite, 'SITES')
      .then((result) => {
        result.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then((url) => this.images.push(url));
        });
        $('#galleryModal').modal('show');
        this.loading = false;
      }).catch((error) => {
        this.throwError('No se pudo cargar la galería de imágenes, inténtelo más tarde', error);
      });
  }
}
