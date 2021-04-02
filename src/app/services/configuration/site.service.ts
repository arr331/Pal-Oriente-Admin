import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Coordinate } from 'src/app/interfaces/coordinate';
import { Site } from 'src/app/interfaces/site';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  idSite: string;
  idMun: string;

  constructor(private fireBase: AngularFireDatabase, private storage: AngularFireStorage, private imageCompress: NgxImageCompressService) { }

  addSite(site: Site) {
    this.fireBase.list(`ALTIPLANO/MUNICIPALITIES/${this.idMun}/sites`).update(site.idSite, site).then(() => {
      const coordinate: Coordinate = { region: 'P', idMun: this.idMun, idSite: site.idSite, name: site.name, x: site.x, y: site.y };
      this.fireBase.list(`COORDINATES/${this.idMun}`).update(site.idSite, coordinate);
    });
  }

  buildSite(form, idMun: string, id: string): Site {
    this.idMun = idMun;
    this.idSite = id ? id : this.fireBase.createPushId();
    const site = { idSite: this.idSite, ...form };
    return site;
  }

  getAllImages(idMun: string, idSite: string) {
    return this.storage.storage.ref(`ALTIPLANO/MUNICIPALITIES/${idMun}/SITES/${idSite}/gallery`).listAll();
  }

  async uploadImg(img) {
    const filePath = `ALTIPLANO/MUNICIPALITIES/${this.idMun}/SITES/${this.idSite}/portada`;
    const imgToSave = await this.compressFile(img);
    const ref = this.storage.ref(filePath);
    await ref.put(imgToSave);
    return await ref.getDownloadURL().toPromise();
  }

  async uploadGalery(images: string[], idMun: string, idSite: string) {
    return await images.forEach(async (img, index) => {
      const blob = await this.compressFile(img);
      this.storage.upload(`ALTIPLANO/MUNICIPALITIES/${idMun}/SITES/${idSite}/gallery/${index}`, blob);
    });
  }

  async compressFile(image) {
    return this.dataURItoBlob((await this.imageCompress.compressFile(image, -1, 50, 50)).split(',')[1]);
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) { int8Array[i] = byteString.charCodeAt(i); }
    return new Blob([int8Array], { type: 'image/jpeg' });
  }
}
