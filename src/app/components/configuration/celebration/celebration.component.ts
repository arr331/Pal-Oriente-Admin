import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CelebrationService } from 'src/app/services/configuration/celebration.service';
import { NgxImageCompressService } from 'ngx-image-compress';
declare var $: any;

@Component({
  selector: 'app-celebration',
  templateUrl: './celebration.component.html',
  styleUrls: ['./celebration.component.scss']
})

export class CelebrationComponent implements OnInit, OnChanges {
  private _celebrationForm: FormGroup;
  private _activityForm: FormGroup;
  listCelebration: Array<any> = [];
  listActivity: Array<any> = [];
  celebration: any;
  activity: any;
  files: FileList;
  file: File;
  url: any;
  imageBlob: any;

  @Input() municipality: any;

  constructor(private formBuilder: FormBuilder, private celebrationService: CelebrationService, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    this.listCelebration = [];
    this.listActivity = [];
    this.celebration = '';
    this.municipality.celebrations ?
      Object.keys(this.municipality.celebrations).forEach((m) => {
        this.listCelebration.push(this.municipality.celebrations[m]);
      }) : '';
    this.buildForm();
  }

  buildForm() {
    this.celebrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      image: [''],
      state: [true]
    });
    this.activityForm = this.formBuilder.group({
      name: [''],
      image: [''],
      state: [true]
    });
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  newCelebration(celebration) {
    this.celebration = celebration;
    celebration ? this.celebrationForm.setValue({
      name: celebration.name, description: celebration.description, image: celebration.image, state: celebration.state
    }) : this.buildForm();

    $('#siteModal').modal('show');
  }

  saveCelebration() {
    if (this.celebrationForm.valid) {
      const celebration = this.celebrationService.buildCelebration(this.celebrationForm.value, this.municipality.idMun, this.celebration ? this.celebration.idCelebration : '');
      if (this.url) {
        var reader = new FileReader();
        reader.onload = async event => {
          await this.compressFile(event.target.result);
          this.celebrationService.uploadImg(this.imageBlob, 0).then(answer => {
            celebration.image = answer;
            this.celebrationService.addCelebration(celebration);
            this.reset(0, celebration, '#siteModal');
          });
        }
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.celebrationService.addCelebration(celebration);
        this.reset(0, celebration, '#siteModal');
      }
    } else {
      console.log('llenar');
    }
  }

  showActivities(celebration) {
    this.celebration = celebration;
    this.listActivity = [];
    celebration.activities ?
      Object.keys(celebration.activities).forEach((m) => {
        this.listActivity.push(celebration.activities[m]);
      }) : '';
  }

  saveActivity() {
    if (this.activityForm.valid) {
      const activity = this.celebrationService.buildActivity(this.activityForm.value, this.municipality.idMun,
        this.celebration.idCelebration, this.activity ? this.activity.idActivity : '');
      if (this.url) {
        var reader = new FileReader();
        reader.onload = async event => {
          await this.compressFile(event.target.result);
          this.celebrationService.uploadImg(this.imageBlob, 1).then(answer => {
            activity.image = answer;
            this.celebrationService.addActivity(activity);
            this.reset(1, activity, '#activityModal');
          });
        }
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.celebrationService.addActivity(activity);
        this.reset(1, activity, '#activityModal');
      }
    } else {
      console.log('llenar');
    }
  }

  newActivity(activity) {
    this.activity = activity;
    activity ? this.activityForm.setValue({
      name: activity.name, image: activity.image, state: activity.state
    }) : this.buildForm();
    $('#activityModal').modal('show');
  }

  reset(wich, item, modal) {
    $(modal).modal('hide');
    this.buildForm();
    wich === 0 ? (this.celebration ? this.listCelebration[this.listCelebration.indexOf(this.celebration)] = item :
      this.listCelebration.push(item)) : (this.activity ? this.listActivity[this.listActivity.indexOf(this.activity)] = item :
        this.listActivity.push(item));
    this.url = null;
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

  public get celebrationForm(): FormGroup { return this._celebrationForm; }
  public set celebrationForm(value: FormGroup) { this._celebrationForm = value; }

  public get activityForm(): FormGroup { return this._activityForm; }
  public set activityForm(value: FormGroup) { this._activityForm = value; }
}
