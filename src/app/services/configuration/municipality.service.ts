import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Municipality } from 'src/app/interfaces/municipality';
import { MunicipalityInfo } from 'src/app/interfaces/municipality-info';

@Injectable({
  providedIn: 'root',
})
export class MunicipalityService {
  id: string;

  constructor(
    private fireBase: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  async saveMunicipality(mpio: Municipality): Promise<void> {
    await this.fireBase
      .list('ALTIPLANO/MUNICIPALITIES')
      .update(mpio.idMun, mpio);
    const mpioInfo: MunicipalityInfo = {
      habitants: mpio.habitants,
      idMun: mpio.idMun,
      image: mpio.image,
      name: mpio.name,
      weather: mpio.weather,
    };
    this.fireBase
      .list('ALTIPLANO/MUNICIPALITIESINFO')
      .update(mpio.idMun, mpioInfo);
  }

  getMunicipios() {
    return this.fireBase.list<Municipality>('ALTIPLANO/MUNICIPALITIES');
  }

  buildMunicipality(form, id): Municipality {
    this.id = id ? id : this.fireBase.createPushId();
    const municipality = { ...form, idMun: this.id };
    return municipality;
  }

  async uploadImg(event) {
    const filePath = `ALTIPLANO/MUNICIPALITIES/${this.id}/portada`;
    const ref = this.storage.ref(filePath);
    await ref.put(event).then();
    return await ref.getDownloadURL().toPromise();
  }
}

