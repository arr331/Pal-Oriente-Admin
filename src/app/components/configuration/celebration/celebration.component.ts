import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { CelebrationService } from 'src/app/services/celebration.service';

declare var $: any;

@Component({
  selector: 'app-celebration',
  templateUrl: './celebration.component.html',
  styleUrls: ['./celebration.component.scss']
})
export class CelebrationComponent implements OnInit {

  //celebrationForm: FormGroup;
  files: FileList;
  file: File;
  url: Observable<string>;
  urlActivity: Observable<string>;

  @Input() municipality: any;
  @Input() celebration: any;
  @Input() update: any;

  fields = {
    name: 'Nombre del municipio',
    description: 'Descripción',
    image: 'Imagen',
  };

  celebrationForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    image: [''],
    activities: new FormArray([new FormGroup({
      nameActivity: new FormControl(''),
      imageActivity: new FormControl('')
    })])
  });

  constructor(private formBuilder: FormBuilder, private storage: AngularFireStorage, private celebrationService: CelebrationService) { }

  ngOnInit(): void {
    // this.celebrationForm = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   description: [''],
    //   image: [''],
    //   activities: new FormArray([new FormGroup({
    //     name: new FormControl(''),
    //     image: new FormControl('')
    //   })])
    // });
    this.update && this.celebration ? this.fillform() : '';

  }

  ngOnChanges(): void{
    this.ngOnInit();
  }

  /*addActivity() {
    (this.celebrationForm.get['activities']).push(new FormGroup({
      'name': new FormControl('', Validators.required),
      'image': new FormControl('', Validators.required)
    }));
  }*/

  activities= this.celebrationForm.get('activities') as FormArray;

  addActivity() {
    const control = new FormControl('', Validators.required);
    this.activities.push(control);
  }

  fillform() {
    this.celebrationForm.get('name').setValue(this.celebration.name);
    this.celebrationForm.get('description').setValue(this.celebration.description);
    this.celebrationForm.get('image').setValue(this.celebration.image);
  }

  saveCelebration(){
    if(!this.update && this.celebrationForm.get('name').value){
      const celebration =  this.celebrationService.buildCelebration(this.celebrationForm.value, this.municipality);
       this.celebrationService.uploadImg(this.url).then(answer => {
        celebration.image = answer;
        this.celebrationService.addCelebration(celebration, this.municipality);
        this.reset('Celebración Guardado');
      });
      const activity= this.celebrationService.buildActivity(this.celebrationForm.get('activities').value[0], this.celebration);
      this.celebrationService.uploadImgActivity(this.urlActivity).then(answer => {
        activity.image = answer;
        this.celebrationService.addActivity(celebration, activity, this.municipality);
        this.reset('Actividad Guardada');
      });
    /*} else if (this.update && this.site && this.celebrationForm.get('name').value) {
      this.celebration = this.siteService.updateSite(this.celebrationForm.value, this.celebration, this.municipality);
      this.files ? this.siteService.uploadGalery(this.files) : '';
      if (!this.url) {
        this.siteService.addSite(this.celebration, this.municipality);
        this.reset('Sitio Actualizado');
      } else {
        this.siteService.uploadImg(this.url).then(answer => {
          this.site.image = answer;
          this.siteService.addSite(this.celebration, this.municipality);
          this.reset('Sitio Actualizado');
        });
      }*/
    }
  }

  reset(msj) {
    console.log(msj);
    this.ngOnInit();
    this.url = null;
    this.files = null;
    $('#modalCreateCelebration').modal('hide');
  }

  clearSite() {
    this.celebrationForm.reset();
    $('#modalCreateCelebration').modal('hide');
  }

  uploadImage(img){
    this.url = img;
  }

  uploadImageActivity(img){
    this.url = img;
  }

}
