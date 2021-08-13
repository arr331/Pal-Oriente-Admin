import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CelebrationService } from 'src/app/services/configuration/celebration.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Municipality } from 'src/app/interfaces/municipality';
import { Celebration } from 'src/app/interfaces/celebration';
import { Activity } from 'src/app/interfaces/activity';
import { GalleryService } from 'src/app/services/configuration/gallery.service';
declare var $: any;

@Component({
  selector: 'app-celebration',
  templateUrl: './celebration.component.html',
  styleUrls: ['./celebration.component.scss'],
})
export class CelebrationComponent implements OnChanges {
  celebrationForm: FormGroup;
  activityForm: FormGroup;
  listCelebration: Celebration[];
  celebration: Celebration;
  listActivity: Activity[];
  activity: Activity;
  files: FileList;
  file: File;
  url: any;
  imageBlob: any;
  images: string[] = [];
  loading: boolean;

  @Input() municipality: Municipality;

  constructor(
    private formBuilder: FormBuilder,
    private celebrationService: CelebrationService,
    private imageCompress: NgxImageCompressService,
    private galleryService: GalleryService
  ) { }

  ngOnChanges(): void {
    this.listCelebration = [];
    this.listActivity = [];
    this.celebration = null;
    this.municipality.celebrations
      ? Object.keys(this.municipality.celebrations).forEach((m) =>
        this.listCelebration.push(this.municipality.celebrations[m])
      )
      : '';
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
      this.municipality.idMun,
      celeb.idCelebration,
      'CELEBRATIONS'
      )
      .then((result) => {
        result.items.forEach((itemRef) => {
          itemRef.getDownloadURL().then((url) => this.images.push(url));
          this.loading = false;
          $('#galleryModal').modal('show');
        }
        );
      });
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
        this.celebration.idCelebration,
        'CELEBRATIONS'
      )
      .then(() => {
        this.loading = false;
        $('#galleryModal').modal('hide');
      });
  }

  newCelebration(celebration: Celebration): void {
    this.celebration = celebration;
    celebration
      ? this.celebrationForm.patchValue(celebration)
      : this.buildForm();
    $('#siteModal').modal('show');
  }

  saveCelebration(): void {
    this.loading = true;
    if (this.celebrationForm.valid) {
      const celebration = this.celebrationService.buildCelebration(
        this.celebrationForm.value,
        this.municipality.idMun,
        this.celebration ? this.celebration.idCelebration : ''
      );
      if (this.url) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          await this.compressFile(event.target.result);
          this.celebrationService
            .uploadImg(this.imageBlob, 0)
            .then((answer) => {
              celebration.image = answer;
              this.celebrationService.addCelebration(celebration);
              this.reset(0, celebration, '#siteModal');
            });
        };
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.celebrationService.addCelebration(celebration);
        this.reset(0, celebration, '#siteModal');
      }
    } else {
      alert('Por favor llenar todos los campos para continuar');
    }
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
    if (this.activityForm.valid) {
      const activity = this.celebrationService.buildActivity(
        this.activityForm.value,
        this.municipality.idMun,
        this.celebration.idCelebration,
        this.activity ? this.activity.idActivity : ''
      );
      if (this.url) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          await this.compressFile(event.target.result);
          this.celebrationService
            .uploadImg(this.imageBlob, 1)
            .then((answer) => {
              activity.image = answer;
              this.celebrationService.addActivity(activity);
              this.reset(1, activity, '#activityModal');
            });
        };
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.celebrationService.addActivity(activity);
        this.reset(1, activity, '#activityModal');
      }
    } else {
      alert('Por favor llenar todos los campos para continuar');
    }
  }

  newActivity(activity): void {
    this.activity = activity;
    activity ? this.activityForm.patchValue(activity) : this.buildForm();
    $('#activityModal').modal('show');
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
