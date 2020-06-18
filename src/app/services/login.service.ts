import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth'
import { auth } from 'firebase/app';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../clases/user';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user= new User();

  constructor(private httpClient:HttpClient, public afAuth: AngularFireAuth) { }

  headers: HttpHeaders= new HttpHeaders({
    'Content-type':'application/json'
  });

  async loginGoogle(){
    try{
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    catch(error){console.log(error)}
  }
  
  isAuth(){   
    return this.afAuth.authState.pipe(map(auth => auth));
  }

  isAuthApi(){
    return 
  }

  logOut() {
    return this.afAuth.auth.signOut();
  }

  logIn(email: string,password: string): Observable<User>{
    let headers= new HttpHeaders().set('Content-type','application/json');

   return this.httpClient.post<User>('http://localhost:8080/controller-user/'+email+'/'+password+'',{headers: headers});
  }

  createUser(user:User): Observable<User>{
    let headers= new HttpHeaders().set('Content-type','application/json')

   return this.httpClient.post<User>('http://localhost:8080/controller-user/user',user,{headers: headers});
  }

  getUsers(): Observable<User[]>{
    return this.httpClient.get<User[]>('http://localhost:8080/controller-user/users');
  }

  UpdateUser(user:User): Observable<any>{
    let headers= new HttpHeaders().set('Content-type','application/json')

   return this.httpClient.put<any>('http://localhost:8080/controller-user/user/'+user.id,user,{headers: headers});
  }


  setUser(user): void{
    let user_string= JSON.stringify(user);
    localStorage.setItem("currentUser",user_string);
  }

  setToken(token): void{
    localStorage.setItem("accessToken", token);
  }

  getToken(){
    return localStorage.getItem("accessToken");
  }

  getCurrentUser(){
    let user_string = localStorage.getItem("currentUser");

    if(isNullOrUndefined(user_string)  ){
      let user= JSON.parse(user_string);
      return user;
    }
    else{
      return null;
    }
  }

  logoutUser(){
    let accessToken= localStorage.getItem("accessToken");
  }

}
