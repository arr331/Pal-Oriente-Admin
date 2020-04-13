import { Injectable } from '@angular/core';
import { Sitio } from '../clases/sitio';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private fireBase: AngularFireDatabase, private storage: AngularFireStorage) { }

  buildSite(form): Sitio {
    const site: Sitio = {
      name: form.name,
      description: form.description,
      galery: this.fireBase.createPushId(),
      image: form.image,
      x: form.x,
      y: form.y,
    };
    return site;
  }

  async uploadImg(img) {
    const file = img.target.files[0];
    const id = Math.random().toString(36).substring(2);
    const filePath = `Z/portadaSite_${id}`;
    const ref = this.storage.ref(filePath);
    await this.storage.upload(filePath, file)
    return await ref.getDownloadURL().toPromise();
  }
}
