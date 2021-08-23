import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Region } from '../../interfaces/region';

@Injectable({
  providedIn: 'root',
})
export class RegionService {
  constructor(
    private fireBase: AngularFireDatabase,
    private storage: AngularFireStorage,
    private imageCompress: NgxImageCompressService
  ) {}

  getAll(): AngularFireList<Region> {
    return this.fireBase.list<Region>('HOME');
  }

  build(regionForm: any): Region {
    return { ...regionForm };
  }

  async save(
    region: Region,
    image: string,
    newImgae: boolean,
    id?: string
  ): Promise<void> {
    region.id = id || this.fireBase.createPushId();
    region.urlImage = newImgae
      ? await this.uploadImg(image, region.id)
      : region.urlImage;
    console.log(region);

    return this.fireBase.list('HOME').update(region.id, region);
  }

  async uploadImg(image: string, id: string): Promise<string> {
    const filePath = `REGION/${id}`;
    const imgToSave = await this.compressFile(image);
    const ref = this.storage.ref(filePath);
    await ref.put(imgToSave);
    return await ref.getDownloadURL().toPromise();
  }

  async compressFile(image) {
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
