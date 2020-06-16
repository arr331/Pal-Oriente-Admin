import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app'
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../clases/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {



  constructor(private httpClient:HttpClient, public afAuth: AngularFireAuth) { }

  async loginGoogle(){
    try{
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    catch(error){console.log(error)}
  }
  
  isAuth(){   
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  logOut() {
    return this.afAuth.auth.signOut();
  }

  logIn(email: string,password: string): Observable<User>{
    let headers= new HttpHeaders().set('Content-type','application/json')

   return this.httpClient.post<User>('http://localhost:8080/controller-user/'+email+'/'+password+'',{headers: headers});
  }

  createUser(user:User): Observable<User>{
    let headers= new HttpHeaders().set('Content-type','application/json')

   return this.httpClient.post<User>('http://localhost:8080/controller-user/',user,{headers: headers});
  }



}
