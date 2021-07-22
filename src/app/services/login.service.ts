import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app';
import { map } from 'rxjs/operators';
import { User } from '../clases/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user = new User();

  constructor(public afAuth: AngularFireAuth) { }

  async loginGoogle() {
    try{
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    catch(error){console.log(error)}
  }
  
  isAuth() {   
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  logOut() {
    return this.afAuth.auth.signOut();
  }

  async loginEmail(email, password) {
    try{
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }
    catch(error){console.log(error)}
  }

  setUser(user): void{
    let user_string= JSON.stringify(user);
    localStorage.setItem('currentUser',user_string);
  }

  setToken(token): void{
    localStorage.setItem('accessToken', token);
  }

  getToken(){
    return localStorage.getItem('accessToken');
  }
}
