import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  constructor(
    private storage: AngularFireStorage,
    private imageCompress: NgxImageCompressService
  ) {}

  getAllImages(
    region: string,
    idMun: string,
    idSite: string,
    item: string
  ): Promise<firebase.storage.ListResult> {
    return this.storage.storage
      .ref(`${region}/MUNICIPALITIES/${idMun}/${item}/${idSite}/gallery`)
      .listAll();
  }

  deleteByUrl(url: string): Promise<void> {
    return this.storage.storage.refFromURL(url).delete();
  }

  async uploadGalery(
    region: string,
    images: string[],
    idMun: string,
    idSite: string,
    item: string
  ): Promise<void> {
    return await images.forEach(async (img, index) => {
      const blob = await this.compressFile(img);
      this.storage.upload(
        `${region}/MUNICIPALITIES/${idMun}/${item}/${idSite}/gallery/${index}`,
        blob
      );
    });
  }

  async compressFile(image: string): Promise<Blob> {
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
