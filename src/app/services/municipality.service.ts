import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Municipality } from '../clases/municipality';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {
  id;

  constructor(private fireBase: AngularFireDatabase, private storage: AngularFireStorage) { }

  addMunicipality(mpio) {
    this.fireBase.list('ALTIPLANO/MUNICIPALITIES').set(mpio.idMun, mpio);
  }

  update(mpio) {
    this.fireBase.list('ZZ').update(mpio.idMun, {
      "description": mpio.description, "idMun": mpio.idMun,
      "image": mpio.image, "name": mpio.name
    });
  }

  buildMunicipality(form): Municipality {
    this.id = this.fireBase.createPushId();
    const municipality: Municipality = {
      name: form.name,
      description: form.description,
      image: form.image,
      sites: '',
      celebrations: '',
      economy: form.economy,
      habitants: form.habitants,
      history: form.history,
      weather: form.weather,
      idMun: this.id
    };

    return municipality;
  }

  updateMunicipality(form, mun) {
    mun.name = form.name;
    mun.description = form.description;
    mun.image = form.image;
    mun.info = mun.info;
    this.id = mun.idMun
    return mun;
  }

  // async uploadImg(img) {
  //   const file = img.target.files[0];    
  //   const filePath = `ZZ`;
  //   // const filePath = `ZZ/portadas/${this.id}`;
  //   const ref = this.storage.ref(filePath);
  //   await this.storage.upload(filePath, file);
  //   return await ref.getDownloadURL().toPromise();
  // }



  async uploadImg(event) {
    const filePath = `ZZ/portadas/${this.id}`;
    // const filePath = `ZZ`; 
    const ref = this.storage.ref(filePath);
    await ref.put(event).then(function(snapshot) {
      console.log('Se carg+o la imagen correctamente');
    });
    return await ref.getDownloadURL().toPromise();
  }




//  async compressFile(image) {
//    await this.imageCompress.compressFile(image, -1, 50, 50).then(
//       result => {
//         this.imageBlob = this.dataURItoBlob(result.split(',')[1]);
        
        
//         // const filePath = `ZZ`;
//         // const ref = this.storage.ref(filePath);
//         // ref.put(this.imageBlob).then(function (snapshot) {
//         //   console.log('Uploaded a blob!');
//         // });
//       });
//   }



//   dataURItoBlob(dataURI) {
//     const byteString = window.atob(dataURI);
//     const arrayBuffer = new ArrayBuffer(byteString.length);
//     const int8Array = new Uint8Array(arrayBuffer);
//     for (let i = 0; i < byteString.length; i++) {
//       int8Array[i] = byteString.charCodeAt(i);
//     }
//     const blob = new Blob([int8Array], { type: 'image/jpeg' });
//     return blob;
//   }


  uploadGalery(images, site) {
    for (let i = 0; i < images.length; i++) {
      const id = site;
      const name = Math.random().toString(36).substring(2);
      const filePath = `ZZ/${id}/img_${name}`;
      this.storage.upload(filePath, images[i]);
    }
  }

}
