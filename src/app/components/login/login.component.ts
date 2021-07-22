import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/clases/user';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = new User();
  logInForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginservice: LoginService, private router: Router) {
  }

  ngOnInit(): void {
    this.logInForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  logIn() {
    this.loginservice.loginEmail(this.logInForm.value['email'], this.logInForm.value['password']).then((response) => {
      console.log(response);
  //  this.user = response;
  //  localStorage.setItem("nameUser",this.user.nameUser);

  /*  
    if (this.user != null) {
      this.router.navigate(['/administration']);
      console.log(this.user);
    } else {
      console.log("Estoy nulo");
    }
  */
    },
      error => alert(error));
  }
}
