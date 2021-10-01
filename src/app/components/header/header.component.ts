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

  constructor(private loginservice: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.loginservice.isAuth();
    this.loginservice.isAuth().subscribe(answer => {
      if (answer) {
        const user: User = new User();
        user.email = answer.email;
        user.idUser = answer.uid;
        user.nameUser = answer.displayName;
        user.rol = 'admin';
        this.loginservice.saveUser(user);
      }
    });
  }

  logOut(): void {
    localStorage.removeItem('nameUser');
    this.loginservice.logOut().then(() => {
      this.user = null;
      this.router.navigate(['/login']);
    });
  }
}
