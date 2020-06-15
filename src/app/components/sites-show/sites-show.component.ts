import { Component, OnInit } from '@angular/core';
import { MuniComponent } from '../muni/muni.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sites-show',
  templateUrl: './sites-show.component.html',
  styleUrls: ['./sites-show.component.scss']
})
export class SitesShowComponent implements OnInit {

  listSitios: Array<any> = [];

  constructor(private muni:MuniComponent, private router:Router, private route:ActivatedRoute) { 
    console.log('sites= '+this.route.snapshot.paramMap.get('sites'));
  }

  ngOnInit(): void {
    this.muni.listSitios= this.listSitios;
  }

}
