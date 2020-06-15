import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app'
import { User } from 'src/app/clases/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  nameUser: string;
  image: string;
  email:string;
  user:any;

  constructor(private loginservice:LoginService) {
    this.nameUser= firebase.auth().currentUser.displayName;
    this.image= firebase.auth().currentUser.photoURL;
    this.email= firebase.auth().currentUser.email;
   }

  ngOnInit(): void {
    /*this.loginservice.isAuth().subscribe((answer) => {
      this.user = answer;
      console.log(this.user);
    });*/
  }

}
