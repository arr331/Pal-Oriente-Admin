import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubregionService } from 'src/app/services/subregion.service';

@Component({
  selector: 'app-subregion',
  templateUrl: './subregion.component.html',
  styleUrls: ['./subregion.component.scss']
})
export class SubregionComponent implements OnInit {

  listItems: Array<any> = [];
  subregionForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private dateService: SubregionService) { }

  ngOnInit(): void {

    this.dateService.getHomeImages().valueChanges().subscribe((answer) => {
      this.listItems = answer;
    });

    this.subregionForm = this.formBuilder.group({
      urlImage: [''],
      name: [''],
      description:['']
   });
  }

}
