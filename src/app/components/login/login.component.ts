import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user = new User();
  logInForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginservice: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.logInForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  logIn(): void {
    this.loginservice.loginEmail(this.logInForm.value['email'], this.logInForm.value['password'])
      .then(() => this.router.navigateByUrl('/configuration'), error => {
        console.error(error);
        
        Swal.fire('Error de autenticación', 'Error intentando iniciar sesión, verifique usuario y contraseña', 'error')
      });
  }
}
