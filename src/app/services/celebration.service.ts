import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { Celebration } from '../clases/celebration';
import { Activity } from '../clases/activity';

@Injectable({
  providedIn: 'root'
})
export class CelebrationService {

  idCelebration;
  idActivity;
  idMun;

  constructor(private fireBase: AngularFireDatabase , private storage: AngularFireStorage) { }

  addCelebration(celebration, id){
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${id}/celebrations`).set(celebration.idCelebration, celebration);
  }

  addActivity(celebration,activity,id){
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${id}/celebrations/${celebration.idCelebration}/activities`).set(activity.idActivity, activity);
  }


  buildCelebration(form, idMun): Celebration {
    this.idCelebration = this.fireBase.createPushId();
    this.idMun = idMun;
    const celebration: Celebration = {
      name: form.name,
      description: form.description,
      image: form.image,
      idCelebration: this.idCelebration,
      activities: '',
    };
    return celebration;
  }

  buildActivity(form, idCelebration): Activity {
    this.idActivity= this.fireBase.createPushId();
    this.idCelebration= idCelebration;
    const activity: Activity= {
      name: form.nameActivity,
      image: form.imageActivity,
      idActivity: this.idActivity,
    };

    return activity;
  }

  async uploadImg(img) {
    const file = img.target.files[0];
    const filePath = `ZZ/celebrations/${this.idMun}/portadas/${this.idCelebration}`;
    const ref = this.storage.ref(filePath);
    await this.storage.upload(filePath, file);
    return await ref.getDownloadURL().toPromise();
  }

  
  async uploadImgActivity(img) {
    const file = img.target.files[0];
    const filePath = `ZZ/celebrations/${this.idMun}/portadas/${this.idCelebration}/activities/${this.idActivity}`;
    const ref = this.storage.ref(filePath);
    await this.storage.upload(filePath, file);
    return await ref.getDownloadURL().toPromise();
  }
}
