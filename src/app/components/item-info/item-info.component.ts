import { Component, OnInit } from '@angular/core';
import { SubregionService } from 'src/app/services/subregion.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss']
})
export class ItemInfoComponent implements OnInit {

  listItems: Array<any> = [];
  numItem: number;

  constructor(private rutaActiva: ActivatedRoute,private dateService: SubregionService) { }

  ngOnInit(): void {
    
    this.dateService.getPlaceInfo().valueChanges().subscribe((answer) => {
      this.listItems = answer;
    });

    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.numItem = params.numItem;
      }
    );
  }



}
