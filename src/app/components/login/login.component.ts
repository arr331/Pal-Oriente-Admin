import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/clases/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
