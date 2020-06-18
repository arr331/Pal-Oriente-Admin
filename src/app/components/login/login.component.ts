import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import { User } from 'src/app/clases/user';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isNew: boolean;
  user= new User();
  logInForm: FormGroup;
  createForm: FormGroup;

  createFormGroup(){
    return new FormGroup({
      email: new FormControl('',[Validators.required]),
      nameUser: new FormControl('',[Validators.required]),
      lastUser: new FormControl('',[Validators.required]),
      password:  new FormControl('',[Validators.required, Validators.minLength(5)])
    })
  };


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

    },
    error => alert(error));

  }

  goRegister(){
    this.isNew= true;
  }

 

  formUser(): void{
    if(this.logInForm.valid){
      this.user.email=this.logInForm.value['email'];
      this.user.nameUser=this.logInForm.value['nameUser'];
      this.user.lastUser=this.logInForm.value['lastUser'];
      this.user.password=this.logInForm.value['password'];
    
    this.createUser();
    }
    else{
      alert("Formulario Invalido");
    }
    
  }

  createUser():void{
      this.loginservice.createUser(this.user).subscribe((response)=>{
        this.user= response;
      });

      alert("Usuario creado correctamente");
  }


}
