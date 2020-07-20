import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class SubregionService {

  list: AngularFireList<any>;

  constructor(private fireBase: AngularFireDatabase) { }


  getHomeImages(){
    return (this.list= this.fireBase.list('HOME'));
  }

  getPlaceInfo(){
    return (this.list= this.fireBase.list('PLACEINFO'));
  }

  getNotices(){
    return (this.list=this.fireBase.list('NEWS'))
  }
  

}

