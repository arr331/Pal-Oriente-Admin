import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: any;
  email:any;

  constructor(private loginservice:LoginService, private router:Router) { }

  ngOnInit(): void {
  }

  async onLoginGoogle(){
    try{
      this.loginservice.loginGoogle()
      .then((res)=>{
          this.router.navigate(['/administration'])
      });
    }
    catch(error)
    {
      console.log(error)
    }

    this.user=firebase.auth().currentUser;
    this.email=firebase.auth().currentUser.email;
    console.log(this.user)
  }

}
