import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataServiceService } from 'src/app/services/data-service.service';
import { MunicipalityService } from 'src/app/services/municipality.service';
import { Router } from '@angular/router';
import { SitesShowComponent } from '../sites-show/sites-show.component';
import { Sitio } from 'src/app/clases/sitio';

@Component({
  selector: 'app-muni',
  templateUrl: './muni.component.html',
  styleUrls: ['./muni.component.scss']
})
export class MuniComponent implements OnInit {

  listMunicipalities: Array<any> = [];
  municipality;
  listSitios: Array<any> = [];
  site: Sitio;
  hola: any = "yesid";

  constructor(private formBuilder: FormBuilder, private municipalityService: MunicipalityService,
    private dateService: DataServiceService, private router:Router) { }

  ngOnInit(): void {

    this.dateService.getMunicipalities().valueChanges().subscribe((answer) => {
      this.listMunicipalities = answer;
    });
  }

  goSites(mpio){
    this.municipality= mpio;
    this.listSitios= [];
    Object.keys(mpio.info).forEach((m) => {
      
      this.site=this.municipality.info[m];
      //console.log(this.site);
      this.listSitios.push(this.municipality.info[m]);
    });
    
    //this.router.navigate(['/subregiones/altiplano/mun']);

  }

}
