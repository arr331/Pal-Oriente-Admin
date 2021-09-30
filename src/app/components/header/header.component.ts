import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: Observable<firebase.User>;
 // userAuth= new User;

  constructor(private loginservice: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.loginservice.isAuth();
    /*this.loginservice.isAuth().subscribe(answer => {
      if (answer) {
        this.user = answer.displayName.split(' ')[0];
        this.userAuth.email = answer.email;
        this.userAuth.idUser = answer.uid;
        this.userAuth.nameUser = answer.displayName;
        this.userAuth.rol = 'admin';
        this.loginservice.saveUser(this.userAuth);
      }
    });*/
  }

  logOut(): void {
    localStorage.removeItem('nameUser');
    this.loginservice.logOut().then(() => {
      this.user = null;
      this.router.navigate(['/login']);
    });
  }
}
