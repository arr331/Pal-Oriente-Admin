import { Injectable } from '@angular/core';
import { Sitio } from '../clases/sitio';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private fireBase: AngularFireDatabase , private storage: AngularFireStorage) { }

  addSite(site, id){
    this.fireBase.list(`Z/${id}/info`).set(site.idSite, site);
  }

  buildSite(form): Sitio {
    const site: Sitio = {
      name: form.name,
      description: form.description,
      image: form.image,
      x: form.x,
      y: form.y,
      idSite: this.fireBase.createPushId()
    };
    return site;
  }
  updateSite(form, site): Sitio {
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
    const id = Math.random().toString(36).substring(2);
    const filePath = `Z/portada/img_${id}`;
    const ref = this.storage.ref(filePath);
    await this.storage.upload(filePath, file)
    return await ref.getDownloadURL().toPromise();
  }
}
