import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: string;

  constructor(private loginservice: LoginService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('nameUser')) {
      this.user = localStorage.getItem('nameUser');
    } else {
      this.loginservice.isAuth().subscribe(answer => {
        if (answer) {
          this.user = answer.displayName.split(' ')[0];
        }
      });
    }
  }

  logOut(): void {
    localStorage.removeItem('nameUser');
    this.loginservice.logOut().then(() => {
      this.user = null;
      this.router.navigate(['/login']);
    });
  }
}
