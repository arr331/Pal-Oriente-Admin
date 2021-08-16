import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Site } from 'src/app/interfaces/site';
import { GalleryService } from 'src/app/services/configuration/gallery.service';
import { SiteService } from 'src/app/services/configuration/site.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
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
  siteList: Site[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private galleryService: GalleryService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.idMun = sessionStorage.getItem('idMun');
    if (this.idMun) {
      const sites = JSON.parse(sessionStorage.getItem('sites'));
      if (sites) {
        Object.keys(sites).forEach((m) => this.siteList.push(sites[m]));
      }
    } else {
      Swal.fire({
        title: 'Advertencia?',
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
        this.idMun,
        this.site.idSite,
        'SITES'
      )
      .then(() => {
        this.loading = false;
        $('#galleryModal').modal('hide');
      }).catch(()=>{
        this.throwError('En este momento no se puede actualizar la galería, intentelo más tarde');
      });
  }

  saveSite(): void {
    this.loading = true;
    if (this.siteForm.valid) {
      const site = this.siteService.buildSite(
        this.siteForm.value,
        this.idMun,
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
          }).catch(()=>{
            this.throwError('No se pudo guardar el sitio, intentelo más tarde');
          });
        };
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.siteService.addSite(site);
        this.reset(site);
      }
    } else {
      Swal.fire('Campos incompletos','Por favor llenar todos los campos para continuar', 'warning');
    }
  }

  throwError(msj?: string): void{
    console.error('Problema interno del server');
    Swal.fire('Problema interno del server',msj,'warning');
    this.loading = false;
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
      .getAllImages(this.idMun, site.idSite, 'SITES')
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
