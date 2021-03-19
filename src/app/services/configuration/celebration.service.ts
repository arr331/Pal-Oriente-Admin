import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { Activity } from 'src/app/interfaces/activity';
import { Celebration } from 'src/app/interfaces/celebration';

@Injectable({
  providedIn: 'root'
})
export class CelebrationService {
  idCelebration: string;
  idActivity: string;
  idMun: string;

  constructor(private fireBase: AngularFireDatabase, private storage: AngularFireStorage) { }

  addCelebration(celebration: Celebration) {
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${this.idMun}/celebrations`).update(celebration.idCelebration, celebration);
  }

  addActivity(activity: Activity) {
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${this.idMun}/celebrations/${this.idCelebration}/activities`).update(activity.idActivity, activity);
  }

  buildCelebration(form, idMun: string, id: string) {
    this.idMun = idMun
    this.idCelebration = id ? id : this.fireBase.createPushId();
    const celebration = { idCelebration: this.idCelebration, ...form };
    return celebration;
  }

  buildActivity(form, idMun: string, idCeleb: string, id: string) {
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
    await ref.put(img).then(() => {
      console.log('Se carg+o la imagen correctamente site');
    });
    return await ref.getDownloadURL().toPromise();
  }
}
