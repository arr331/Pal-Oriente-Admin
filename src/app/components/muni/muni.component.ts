import { Component, OnInit } from '@angular/core';
import { MunicipalityService } from 'src/app/services/configuration/municipality.service';

@Component({
  selector: 'app-muni',
  templateUrl: './muni.component.html',
  styleUrls: ['./muni.component.scss']
})
export class MuniComponent implements OnInit {

  listMunicipalities: Array<any> = [];
  municipality;
  listSitios: Array<any> = [];
  hola: any = "yesid";

  constructor(private municipalityService: MunicipalityService) { }

  ngOnInit(): void {

    this.municipalityService.getMunicipios().valueChanges().subscribe((answer) => {
      this.listMunicipalities = answer;
    });
  }

  goSites(mpio) {
    this.municipality = mpio;
    this.listSitios = [];
    Object.keys(mpio.info).forEach((m) => {
      this.listSitios.push(this.municipality.info[m]);
    });
  }
}
