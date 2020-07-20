import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MunicipalityService } from 'src/app/services/municipality.service';
import { DataServiceService } from 'src/app/services/data-service.service';

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
  listMunicipalities: Array<any> = [];


  constructor(private municipalityService: MunicipalityService,
    private dateService: DataServiceService, private formBuilder: FormBuilder,private router:Router, private route:ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    this.dateService.getMunicipalities().valueChanges().subscribe((answer) => {
      this.listMunicipalities = answer;
    });
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }


}
