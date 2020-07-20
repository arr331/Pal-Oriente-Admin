import { Injectable } from '@angular/core';
import {AngularFireList, AngularFireDatabase} from 'angularfire2/database';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  list: AngularFireList<any>;

  constructor(private fireBase: AngularFireDatabase ) {}

  getMunicipalities() {
    return (this.list = this.fireBase.list('ZZ'));
  }

  getMunicipios() {
    return (this.list = this.fireBase.list('ALTIPLANO/MUNICIPALITIES'));
  }

  getID(id) {
    return (this.list = this.fireBase.list('ZZ', (re) =>
      re.orderByChild('id').equalTo(id)
    ));
  }

  getHomeImages(){
    return (this.list= this.fireBase.list('HOME'))
  }
}
