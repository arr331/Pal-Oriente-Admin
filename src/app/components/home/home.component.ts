import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  listMunicipalities: Array<any> = [];
  municipality;
  listSitios: Array<any> = [];
  showList = false;
  
  constructor(
    private dateService: DataServiceService) { }

  ngOnInit(): void {
    this.dateService.getMunicipalities().valueChanges().subscribe((answer) => {
        this.listMunicipalities = answer;
      });
  }

  showInfo(mpio) {
    this.municipality = mpio;
    this.listSitios = [];
    Object.keys(this.municipality.info).forEach((m) => {
      this.listSitios.push(this.municipality.info[m]);
    });
    $('#modal').modal('show');
  }

  listMpio() {
    this.showList = true;
  }
  
  //TRae todas las url del la carpeta
  s() { 
    // var sorage = this.storage.storage;
    // var storageRef = sorage.ref('Z');

    // storageRef.listAll().then(result => {
    //   result.items.forEach(itemRef => {
    //     itemRef.getDownloadURL().then((url) => {
    //       console.log(url, 'todas url');
    //     });

    //     // All the items under listRef.
    //   });
    // })
  }
}
