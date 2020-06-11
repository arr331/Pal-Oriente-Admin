import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app'
import { User } from 'src/app/clases/user';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  nameUser: string;
  image: string;
  email:string;

  constructor() {
    this.nameUser= firebase.auth().currentUser.displayName;
    this.image= firebase.auth().currentUser.photoURL;
    this.email= firebase.auth().currentUser.email;
   }

  ngOnInit(): void {
  }

}
