import { Component, OnInit, Input } from '@angular/core';
import { MunicipalityService } from 'src/app/services/configuration/municipality.service';

@Component({
  selector: 'app-sites-show',
  templateUrl: './sites-show.component.html',
  styleUrls: ['./sites-show.component.scss']
})
export class SitesShowComponent implements OnInit {

  @Input() listSitios: Array<any> = [];
  @Input() site: any;
  @Input() hola: string;
  listMunicipalities: Array<any> = [];

  constructor(private municipalityService: MunicipalityService) {}

  ngOnInit(): void {
    this.municipalityService.getMunicipios().valueChanges().subscribe((answer) => {
      this.listMunicipalities = answer;
    });
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }
}
