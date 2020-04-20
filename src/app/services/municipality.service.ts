import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Municipality } from '../clases/municipality';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {
  url: Observable<string>;

  constructor(private fireBase: AngularFireDatabase, private storage: AngularFireStorage) { }

  addMunicipality(mpio) { 
    this.fireBase.list('Z').set(mpio.idMun, mpio);
  }

  update(mpio) { 
    this.fireBase.list('Z').update(mpio.idMun, {"description": mpio.description, "idMun": mpio.idMun,
     "image": mpio.image, "name": mpio.name});
  }

  buildMunicipality(form): Municipality {
    const municipality: Municipality = {
      name: form.name,
      description: form.description,
      image: form.image,
      info: '',
      idMun: this.fireBase.createPushId()
    };
    return municipality;
  } 

  // updateMunicipality(form, mun): Municipality {
  //   return new Municipality(form.name, form.description, form.image, mun.idMun);   
  // } 
   
  updateMunicipality(form, mun) {
    mun.name = form.name;
    mun.description = form.description;
    mun.image = form.image;
    mun.info = mun.info;
    return mun;
  } 

  async uploadImg(img) {
    const file = img.target.files[0];
    const id = Math.random().toString(36).substring(2);
    const filePath = `Z/portada/img_${id}`;
    const ref = this.storage.ref(filePath);
    await this.storage.upload(filePath, file)
    return await ref.getDownloadURL().toPromise();
  }

  uploadGalery(images, site){
    for (let i = 0; i < images.length; i++) {
      const id = site
      const name = Math.random().toString(36).substring(2);
      const filePath = `Z/${id}/img_${name}`;
      this.storage.upload(filePath, images[i]);
    }
  }
}
