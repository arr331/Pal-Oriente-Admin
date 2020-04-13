import { Injectable } from '@angular/core';
import {AngularFireList, AngularFireDatabase} from 'angularfire2/database';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  list: AngularFireList<any>;

  constructor(private fireBase: AngularFireDatabase ) {}

  getMunicipalities() {
    return (this.list = this.fireBase.list('Z'));
  }

  getID(id) {
    return (this.list = this.fireBase.list('Z', (re) =>
      re.orderByChild('id').equalTo(id)
    ));
  }
}
