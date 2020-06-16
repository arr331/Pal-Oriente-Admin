import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as firebase from 'firebase/app';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isNew: boolean;
  user: any;
  email:string="yesid";
  pass:string="123";
  logInForm: FormGroup;

  createFormGroup(){
    return new FormGroup({
      email: new FormControl(''),
      password:  new FormControl('')
    })
  }

  constructor(private formBuilder: FormBuilder, private loginservice:LoginService, private router:Router) { 
    this.logInForm= this.createFormGroup();
  }

  ngOnInit(): void {
  }

  onLoginGoogle(){
   this.loginservice.loginGoogle().then(res =>{
          this.router.navigate(['/inicio'])
    });
  }

 ingresar(){
      console.log(this.logInForm.value['email']);
      console.log(this.logInForm.value['password']);
      
    this.loginservice.logIn(this.logInForm.value['email'],this.logInForm.value['password']).subscribe((response)=>{
      console.log(response);
      this.user= response;

      if(this.user!=null){
        this.router.navigate(['/administration']);
        console.log(this.user);
      }
      else{
        console.log("Estoy nulo");
      }

    });

  }

}
