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

  addSite(site, id){
    this.fireBase.list(`ZZ/${id}/info`).set(site.idSite, site);
  }

  buildSite(form, idMun): Sitio {
    this.idSite = this.fireBase.createPushId();
    this.idMun = idMun;
    const site: Sitio = {
      name: form.name,
      description: form.description,
      image: form.image,
      x: form.x,
      y: form.y,
      idSite: this.idSite
    };
    return site;
  }
  
  updateSite(form, site, idMun): Sitio {
    this.idSite = site.idSite;
    this.idMun = idMun;
    const updateSite: Sitio = {
      name: form.name,
      description: form.description,
      image: form.image,
      x: form.x,
      y: form.y,
      idSite: site.idSite
    };
    return updateSite;
  }

  async uploadImg(img) {
    const file = img.target.files[0];
    const filePath = `ZZ/sites/${this.idMun}/portadas/${this.idSite}`;
    const ref = this.storage.ref(filePath);
    await this.storage.upload(filePath, file);
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
