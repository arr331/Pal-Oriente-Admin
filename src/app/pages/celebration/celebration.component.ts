import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CelebrationService } from 'src/app/services/configuration/celebration.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Celebration } from 'src/app/interfaces/celebration';
import { Activity } from 'src/app/interfaces/activity';
import { GalleryService } from 'src/app/services/configuration/gallery.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormValidator } from 'src/app/utils/form-validator';
import { Breadcrumb, BreadPaths } from 'src/app/utils/breadcrumb';
declare const $: any;

@Component({
  selector: 'app-celebration',
  templateUrl: './celebration.component.html',
  styleUrls: ['./celebration.component.scss'],
})
export class CelebrationComponent implements OnInit {
  celebrationForm: FormGroup;
  activityForm: FormGroup;
  listCelebration: Celebration[] = [];
  listActivity: Activity[] = [];
  celebration: Celebration;
  activity: Activity;
  files: FileList;
  file: File;
  url: any;
  imageBlob: any;
  images: string[] = [];
  loading: boolean;
  idMun: string;
  region: string;
  image: string;
  fields = {
    name: 'nombre',
    description: 'descripción',
  }

  constructor(
    private formBuilder: FormBuilder,
    private celebrationService: CelebrationService,
    private imageCompress: NgxImageCompressService,
    private galleryService: GalleryService,
    private router: Router
  ) {
    Breadcrumb.paths.next(BreadPaths.celebration);
  }

  ngOnInit(): void {
    this.idMun = sessionStorage.getItem('idMun');
    this.region = sessionStorage.getItem('region');
    if (this.idMun && this.region) {
      const celebrations: Celebration[] = JSON.parse(
        sessionStorage.getItem('celebrations')
      );
      if (celebrations && Object.keys(celebrations).length > 0) {
        Object.keys(celebrations).forEach((m) =>
          this.listCelebration.push(celebrations[m])
        );
      }
    } else {
      Swal.fire({
        title: 'Advertencia?',
        html: 'Debe seleccionar un municipio',
        confirmButtonText: `Ir a municipios`,
        icon: 'warning',
      }).then(() => {
        this.router.navigate(['municipios']);
      });
    }
    this.buildForm();
  }

  buildForm(): void {
    this.celebrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      reference: [''],
      state: [true],
    });
    this.activityForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: [''],
      state: [true],
    });
  }

  openGallery(celeb: Celebration): void {
    this.celebration = celeb;
    this.images = [];
    this.loading = true;
    this.galleryService
      .getAllImages(
        this.region,
        this.idMun,
        celeb.idCelebration,
        'CELEBRATIONS'
      )
      .then((result) => {
        result.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then((url) => this.images.push(url));
        });
        $('#galleryModal').modal('show');
        this.loading = false;
      })
      .catch(() => (this.loading = false));
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
        this.celebration.idCelebration,
        'CELEBRATIONS'
      )
      .then(() => {
        this.loading = false;
        $('#galleryModal').modal('hide');
      })
      .catch((error) => {
        this.throwError(
          'En este momento no se puede actualizar la galería, intentelo más tarde',
          error
        );
      });
  }

  newCelebration(celebration: Celebration): void {
    this.celebration = celebration;
    this.url = null;
    if (celebration) {
      this.celebrationForm.patchValue(celebration);
      this.image = celebration.image;
    } else {
      this.buildForm();
      this.image = '';
    }
    $('#siteModal').modal('show');
  }

  saveCelebration(): void {
    if (FormValidator.validateForm(this.celebrationForm) && this.image) {
      if (this.celebration || this.validateName()) {
        this.loading = true;
        const celebration = this.celebrationService.buildCelebration(
          this.celebrationForm.value,
          this.idMun,
          this.celebration ? this.celebration.idCelebration : ''
        );
        if (this.url) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            await this.compressFile(event.target.result);
            this.celebrationService
              .uploadImg(this.region, this.imageBlob, 0)
              .then((answer) => {
                celebration.image = answer;
                this.celebrationService.addCelebration(this.region, celebration);
                this.reset(0, celebration, '#siteModal');
              })
              .catch((error) => {
                this.throwError(
                  'No se pudo guardar el sitio, inténtelo más tarde',
                  error
                );
              });
          };
          reader.readAsDataURL(this.url);
        } else {
          this.celebrationService.addCelebration(this.region, celebration);
          this.reset(0, celebration, '#siteModal');
        }
      } else {
        Swal.fire('Atención', `Ya existe una celebración con el mismo nombre`, 'info');
      }
    } else {
      const imageRequerid = this.image ? '' : ', imagen'
      const invalids = `${FormValidator.msgInvalidKeys(this.fields, FormValidator.getInvalids(this.celebrationForm))}${imageRequerid}`;
      Swal.fire('Atención', `Los siguientes campos son inválidos: <br> <strong>${invalids}</strong>`, 'info');
    }
  }

  validateName(): boolean {
    const name: string = this.celebrationForm.get('name').value;
    return !this.listCelebration.some(cel => cel.name.trim().toLowerCase() === name.trim().toLowerCase());
  }

  readImage(file: File): void {
    this.url = file;
    const reader = new FileReader();
    reader.onload = (event) => (this.image = event.target.result.toString());
    reader.readAsDataURL(file);
  }

  showActivities(celebration): void {
    this.celebration = celebration;
    this.listActivity = [];
    celebration.activities
      ? Object.keys(celebration.activities).forEach((m) =>
        this.listActivity.push(celebration.activities[m])
      )
      : '';
  }

  saveActivity(): void {
    if (FormValidator.validateForm(this.activityForm) && this.image) {
      if (this.activity || this.validateNameActivity()) {
        this.loading = true;
        const activity = this.celebrationService.buildActivity(
          this.activityForm.value,
          this.idMun,
          this.celebration.idCelebration,
          this.activity ? this.activity.idActivity : ''
        );
        if (this.url) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            await this.compressFile(event.target.result);
            this.celebrationService
              .uploadImg(this.region, this.imageBlob, 1)
              .then((answer) => {
                activity.image = answer;
                this.celebrationService.addActivity(this.region, activity);
                this.reset(1, activity, '#activityModal');
              })
              .catch((error) => {
                this.throwError(
                  'No se pudo guardar la actividad, intentelo más tarde',
                  error
                );
              });
          };
          reader.readAsDataURL(this.url);
        } else {
          this.celebrationService.addActivity(this.region, activity);
          this.reset(1, activity, '#activityModal');
        }
      } else {
        Swal.fire('Atención', `Ya existe una atividad con el mismo nombre`, 'info');
      }
    } else {
      const name = this.activityForm.get('name').invalid ? 'nombre' : '';
      const img = this.image ? '' : ', imagen';
      Swal.fire('Atención', `Los siguientes campos son inválidos: <br> <strong>${name}${img}</strong>`, 'info');
    }
  }

  validateNameActivity(): boolean {
    const name: string = this.activityForm.get('name').value;
    return !this.listActivity.some(act => act.name.trim().toLowerCase() === name.trim().toLowerCase());
  }

  newActivity(activity: Activity): void {
    this.activity = activity;
    this.url = null;
    if (activity) {
      this.activityForm.patchValue(activity);
      this.image = activity.image;
    } else {
      this.buildForm();
      this.image = '';
    }
    $('#activityModal').modal('show');
  }

  throwError(msj: string, err?: any): void {
    console.error(err);
    Swal.fire('Problema interno del servidor', msj, 'warning');
    this.loading = false;
  }

  reset(wich, item, modal): void {
    this.loading = false;
    $(modal).modal('hide');
    this.buildForm();
    wich === 0
      ? this.celebration
        ? (this.listCelebration[
          this.listCelebration.indexOf(this.celebration)
        ] = item)
        : this.listCelebration.push(item)
      : this.activity
        ? (this.listActivity[this.listActivity.indexOf(this.activity)] = item)
        : this.listActivity.push(item);
    this.url = null;
  }

  async compressFile(image): Promise<void> {
    this.imageBlob = this.dataURItoBlob(
      (await this.imageCompress.compressFile(image, -1, 50, 50)).split(',')[1]
    );
  }

  dataURItoBlob(dataURI): Blob {
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
