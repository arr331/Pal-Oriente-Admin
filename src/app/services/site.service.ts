import { Injectable } from '@angular/core';
import { Sitio } from '../clases/sitio';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  idSite;
  idMun;

  constructor(private fireBase: AngularFireDatabase , private storage: AngularFireStorage) { }

  addSite(site){
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${this.idMun}/sites`).update(site.idSite, site);
  }

  buildSite(form, idMun, id) {
    this.idMun = idMun
    this.idSite = id ? id : this.fireBase.createPushId();
    const site = { idSite: this.idSite, ...form};
    return site;
  }

  async uploadImg(img) {
    const filePath = `ALTIPLANO/MUNICIPALITIES/${this.idMun}/SITES/${this.idSite}/portada`;
    const ref = this.storage.ref(filePath);
    await ref.put(img).then(function (snapshot) {
      console.log('Se carg+o la imagen correctamente site');
    });
    return await ref.getDownloadURL().toPromise();
  }

   uploadGalery(images) {
    for (let i = 0; i < images.length; i++) {
      const name = this.fireBase.createPushId();
      const filePath = `ZZ/sites/${this.idMun}/galerias/${this.idSite}/${name}`;
       this.storage.upload(filePath, images[i]);
    }
  }
}
