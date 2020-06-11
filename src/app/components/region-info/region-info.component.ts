import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SubregionService } from 'src/app/services/subregion.service';

@Component({
  selector: 'app-region-info',
  templateUrl: './region-info.component.html',
  styleUrls: ['./region-info.component.scss']
})

export class RegionInfoComponent implements OnInit {
  listItems: Array<any> = [];
  subregionForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private dateService: SubregionService) { }

  ngOnInit(): void {
    this.dateService.getPlaceInfo().valueChanges().subscribe((answer) => {
      this.listItems = answer;
    });

    this.subregionForm = this.formBuilder.group({
       urlImage: [''],
       name: [''],
    });

  }

}
