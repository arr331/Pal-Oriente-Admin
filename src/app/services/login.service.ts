import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {

  constructor(private router: Router, private loginService: LoginService) {}

  canActivate() {
    return this.loginService.isAuth().pipe(
      take(1),
      map(user => {
        if(user) {
          this.router.navigateByUrl('/regiones');
          return false
        }
        return true
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  user = new User();

  constructor(public afAuth: AngularFireAuth, private fireBase: AngularFireDatabase,) {}

  async loginGoogle(): Promise<auth.UserCredential> {
    try {
      return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        'Error iniciando sesión, por favor inténtelo más tarde',
        'error'
      );
    }
  }

  isAuth(): Observable<firebase.User> {
    return this.afAuth.authState.pipe(map((auth) => auth));
  }

  logOut(): Promise<void> {
    return this.afAuth.auth.signOut().catch(() => {
      Swal.fire(
        'Error',
        'Error cerrando sesión, por favor inténtelo más tarde',
        'error'
      );
    });
  }

  async loginEmail(email, password): Promise<auth.UserCredential> {
    try {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        'Error iniciando sesión, por favor inténtelo más tarde',
        'error'
      );
    }
  }

  setUser(user): void {
    const userString = JSON.stringify(user);
    localStorage.setItem('currentUser', userString);
  }

  setToken(token): void {
    localStorage.setItem('accessToken', token);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  saveUser(user: User) {
    return this.fireBase.list('USERS').update(user.idUser, user);
  }
}

