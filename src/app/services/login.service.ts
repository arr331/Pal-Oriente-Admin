import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {



  constructor(public afAuth: AngularFireAuth) { }

  async loginGoogle(){
    try{
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    catch(error){console.log(error)}
  }
  
  isAuth(){   
    this.afAuth.authState.pipe(map(auth => auth));
    return firebase.auth().currentUser;
  }

}
