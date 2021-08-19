import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
import { New } from 'src/app/interfaces/new';
import { AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root',
})
export class NewService {
  constructor(
    private fireBase: AngularFireDatabase,
    private storage: AngularFireStorage,
    private imageCompress: NgxImageCompressService
  ) {}

  getAll() : AngularFireList<New> {
    return this.fireBase.list<New>('NEWS');
  }

  async save(nw: Partial<New>, image: string, decisionSave: boolean) : Promise<void>{
    nw.id = nw.id || this.fireBase.createPushId();
    decisionSave ? nw.image = await this.uploadImg(image, nw.id):'';
    return this.fireBase.list('NEWS').update(nw.id, nw);
  }

  delete(nw: Partial<New>){
    this.fireBase.list('NEWS').remove(nw.id);
    this.deleteByUrl(nw.image);
  }

  deleteByUrl(url: string) : Promise<void> {
    return this.storage.storage.refFromURL(url).delete();
  }

  async uploadImg(image: string, id: string): Promise<string> {
    const filePath = `NEWS/${id}`;
    const imgToSave = await this.compressFile(image);
    const ref = this.storage.ref(filePath);
    await ref.put(imgToSave);
    return await ref.getDownloadURL().toPromise();
  }

  async compressFile(image) : Promise<Blob> {
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
