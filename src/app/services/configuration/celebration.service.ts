import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { Activity } from 'src/app/interfaces/activity';
import { Celebration } from 'src/app/interfaces/celebration';

@Injectable({
  providedIn: 'root',
})
export class CelebrationService {
  idCelebration: string;
  idActivity: string;
  idMun: string;

  constructor(
    private fireBase: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

  addCelebration(region: string, celebration: Celebration): void {
    this.fireBase
      .list(`${region}/MUNICIPALITIES/${this.idMun}/celebrations`)
      .update(celebration.idCelebration, celebration);
  }

  addActivity(region: string, activity: Activity): void {
    this.fireBase
      .list(
        `${region}/MUNICIPALITIES/${this.idMun}/celebrations/${this.idCelebration}/activities`
      )
      .update(activity.idActivity, activity);
  }

  buildCelebration(form, idMun: string, id: string): Celebration {
    this.idMun = idMun;
    this.idCelebration = id ? id : this.fireBase.createPushId();
    const celebration = { idCelebration: this.idCelebration, ...form };
    return celebration;
  }

  buildActivity(form, idMun: string, idCeleb: string, id: string): any {
    this.idMun = idMun;
    this.idCelebration = idCeleb;
    this.idActivity = id ? id : this.fireBase.createPushId();
    const activity = { idActivity: this.idActivity, ...form };
    return activity;
  }

  async uploadImg(region: string, img, wich): Promise<any> {
    const filePath =
      wich === 0
        ? `${region}/MUNICIPALITIES/${this.idMun}/CELEBRATIONS/${this.idCelebration}/portada`
        : `${region}/MUNICIPALITIES/${this.idMun}/CELEBRATIONS/${this.idCelebration}/activities/${this.idActivity}/portada`;
    const ref = this.storage.ref(filePath);
    await ref.put(img).then();
    return await ref.getDownloadURL().toPromise();
  }
}
