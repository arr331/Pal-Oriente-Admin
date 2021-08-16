import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  listUsers: Array<any> = [];
  user = new User();
  logInForm: FormGroup;
  id: string;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.logInForm = this.formBuilder.group({
      email: ['', Validators.required],
      nameUser: ['', Validators.required],
      lastUser: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  openModal(user) {
    this.id = user.idUser;
    $('#modal').modal('show');
  }
}
