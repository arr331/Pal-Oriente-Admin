import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import {faUser} from '@fortawesome/free-solid-svg-icons';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: any;
  email:any;
  faUser= faUser;

  constructor(private loginservice:LoginService, private router:Router) { }

  ngOnInit(): void {
  }


  showForm(){
    $('#modal').modal('show');
  }

  showFormRegister(){
    $('#modalRegister').modal('show');
  }

  logOut(){
    
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
