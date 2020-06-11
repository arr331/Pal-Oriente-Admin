import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SubregionService } from 'src/app/services/subregion.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  //urlImage: String;
  listImages: Array<any> = [];
  subregionForm: FormGroup;


  constructor(private formBuilder: FormBuilder,private dateService: SubregionService) { }

  ngOnInit(): void {
    this.dateService.getHomeImages().valueChanges().subscribe((answer) => {
      this.listImages = answer;
    });

    this.subregionForm = this.formBuilder.group({
       urlImage: [''],
       name: [''],
       description:['']
    });

  }

}
