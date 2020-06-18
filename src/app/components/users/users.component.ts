import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/clases/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  listUsers: Array<any> = [];
  user= new User;
  logInForm: FormGroup;
  id: string;

  constructor(private loginservice: LoginService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.logInForm = this.formBuilder.group({
      email: ['', Validators.required],
      nameUser: ['', Validators.required],
      lastUser: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginservice.getUsers().subscribe(
      (users)=> {
        this.listUsers= users;
        console.log(users);
      }
    );

    
  }

  openModal(user){
    this.id= user.id;
    $('#modal').modal('show');
  }

  
  updateUser(){
      this.user= { ...this.logInForm.value };
      this.user.id= this.id;
      this.loginservice.UpdateUser(this.user).subscribe((response)=>{
        alert('Actualizado');
      })
  }

}
