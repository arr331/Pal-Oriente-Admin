import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Coordinate } from 'src/app/interfaces/coordinate';
import { Site } from 'src/app/interfaces/site';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  idSite: string;
  idMun: string;

  constructor(private fireBase: AngularFireDatabase, private storage: AngularFireStorage) { }

  addSite(site: Site) {
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${this.idMun}/sites`).update(site.idSite, site).then(() => {
      const coordinate: Coordinate = { region: 'P', idMun: this.idMun, idSite: site.idSite, name: site.name, x: site.x, y: site.y };
      this.fireBase.list(`COORDINATES/${this.idMun}`).update(site.idSite, coordinate);
    });
  }

  buildSite(form, idMun: string, id: string): Site {
    this.idMun = idMun
    this.idSite = id ? id : this.fireBase.createPushId();
    const site = { idSite: this.idSite, ...form };
    return site;
  }

  async uploadImg(img) {
    const filePath = `ALTIPLANO/MUNICIPALITIES/${this.idMun}/SITES/${this.idSite}/portada`;
    const ref = this.storage.ref(filePath);
    await ref.put(img).then(() => {
      console.log('Se carg+o la imagen correctamente site');
    });
    return await ref.getDownloadURL().toPromise();
  }

  uploadGalery(images) {
    for (let i = 0; i < images.length; i++) {
      const name = this.fireBase.createPushId();
      const filePath = `ALTIPLANO/MUNICIPALITIES/${this.idMun}/SITES/${this.idSite}/${name}`;
      this.storage.upload(filePath, images[i]);
    }
  }
}
