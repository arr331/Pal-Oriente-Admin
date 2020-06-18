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
  user = new User();
  logInForm: FormGroup;
  createForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginservice: LoginService, private router: Router) {
  }

  ngOnInit(): void {
    this.logInForm = this.formBuilder.group({
      email: ['', Validators.required],
      nameUser: ['', Validators.required],
      lastUser: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLoginGoogle() {
    this.loginservice.loginGoogle().then(res => {
      this.router.navigate(['/inicio'])
    });
  }


  ingresar() {
    console.log(this.logInForm.value['email']);
    console.log(this.logInForm.value['password']);

    this.loginservice.logIn(this.logInForm.value['email'], this.logInForm.value['password']).subscribe((response) => {
      console.log(response);
      this.user = response;

      if (this.user != null) {
        this.router.navigate(['/administration']);
        console.log(this.user);
      }
      else {
        console.log("Estoy nulo");
      }

    },
      error => alert(error));

  }

  goRegister() {
    this.isNew = true;
  }

  formUser(): void {
    if (this.logInForm.valid) {
      this.user = { ...this.logInForm.value };
      this.createUser();
    }
    else {
      alert("Formulario Invalido");
    }

  }

  createUser(): void {
    this.loginservice.createUser(this.user).subscribe((response) => {
      this.user = response;
    });

    alert("Usuario creado correctamente");
  }

}
