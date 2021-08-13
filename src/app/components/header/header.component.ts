import { Component, OnInit, OnChanges } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  user: string;

  constructor(private loginservice: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loginservice
      .isAuth()
      .subscribe((answer) =>
        answer ? (this.user = answer.displayName.split(' ')[0]) : ''
      );
    this.user = localStorage.getItem('nameUser');
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  logOut() {
    localStorage.removeItem('nameUser');
    this.loginservice.logOut().then((res) => {
      this.user = null;
      this.router.navigate(['/inicio']);
    });
  }
}
