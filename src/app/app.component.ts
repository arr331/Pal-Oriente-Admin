import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: Observable<firebase.User>;

  constructor(private loginservice: LoginService) {
    this.user = loginservice.isAuth();
  }
}
