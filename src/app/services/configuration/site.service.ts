import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Coordinate } from 'src/app/interfaces/coordinate';
import { Site } from 'src/app/interfaces/site';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  idSite: string;
  idMun: string;

  constructor(
    private fireBase: AngularFireDatabase,
    private storage: AngularFireStorage,
    private imageCompress: NgxImageCompressService
  ) {}

  addSite(site: Site) : void {
    this.fireBase
      .list(`ALTIPLANO/MUNICIPALITIES/${this.idMun}/sites`)
      .update(site.idSite, site)
      .then(() => {
        const coordinate: Coordinate = {
          region: 'P',
          idMun: this.idMun,
          idSite: site.idSite,
          name: site.name,
          x: site.x,
          y: site.y,
        };
        this.fireBase
          .list(`COORDINATES/${this.idMun}`)
          .update(site.idSite, coordinate);
      });
  }

  buildSite(form, idMun: string, id: string): Site {
    this.idMun = idMun;
    this.idSite = id ? id : this.fireBase.createPushId();
    const site = { idSite: this.idSite, ...form };
    return site;
  }

  async uploadImg(img) : Promise<any> {
    const filePath = `ALTIPLANO/MUNICIPALITIES/${this.idMun}/SITES/${this.idSite}/portada`;
    const imgToSave = await this.compressFile(img);
    const ref = this.storage.ref(filePath);
    await ref.put(imgToSave);
    return await ref.getDownloadURL().toPromise();
  }

  async compressFile(image) : Promise<Blob>{
    return this.dataURItoBlob(
      (await this.imageCompress.compressFile(image, -1, 50, 50)).split(',')[1]
    );
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/jpeg' });
  }
}
