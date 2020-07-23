import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class CelebrationService {
  idCelebration;
  idActivity;
  idMun;

  constructor(private fireBase: AngularFireDatabase, private storage: AngularFireStorage) { }

  addCelebration(celebration) {
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${this.idMun}/celebrations`).update(celebration.idCelebration, celebration);
  }

  addActivity(activity) {
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${this.idMun}/celebrations/${this.idCelebration}/activities`).update(activity.idActivity, activity);
  }

  buildCelebration(form, idMun, id) {
    this.idMun = idMun
    this.idCelebration = id ? id : this.fireBase.createPushId();
    const celebration = { idCelebration: this.idCelebration, ...form };
    return celebration;
  }

  buildActivity(form, idMun, idCeleb, id) {
    this.idMun = idMun;
    this.idCelebration = idCeleb;
    this.idActivity = id ? id : this.fireBase.createPushId();
    const activity = { idActivity: this.idActivity, ...form };
    return activity;
  }

  async uploadImg(img, wich) {
    const filePath = wich === 0 ? `ALTIPLANO/MUNICIPALITIES/${this.idMun}/CELEBRATIONS/${this.idCelebration}/portada` :
      `ALTIPLANO/MUNICIPALITIES/${this.idMun}/CELEBRATIONS/${this.idCelebration}/activities/${this.idActivity}/portada`;
    const ref = this.storage.ref(filePath);
    await ref.put(img).then(function (snapshot) {
      console.log('Se carg+o la imagen correctamente site');
    });
    return await ref.getDownloadURL().toPromise();
  }
}
