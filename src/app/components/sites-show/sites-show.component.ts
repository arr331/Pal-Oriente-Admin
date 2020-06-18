import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sites-show',
  templateUrl: './sites-show.component.html',
  styleUrls: ['./sites-show.component.scss']
})
export class SitesShowComponent implements OnInit {

  @Input() listSitios: Array<any> = [];
  @Input() site:any;
  @Input() hola: string;
  siteForm: FormGroup;


  constructor(private formBuilder: FormBuilder,private router:Router, private route:ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    console.log(this.site);
    console.log(this.hola);
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }


}
