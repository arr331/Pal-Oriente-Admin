import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region } from 'src/app/interfaces/region';
import { RegionService } from 'src/app/services/configuration/region.service';
declare const $: any;

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {
  regionForm: FormGroup;
  regionList: Region[];
  image: string;
  loading: boolean;
  region: Region;

  constructor(private formBuilder: FormBuilder, private regionService: RegionService) { }

  ngOnInit(): void {
    this.loading = true;
    this.regionService.getAll().valueChanges().subscribe(answer => {
      this.regionList = answer;
      this.loading = false;
    });
    this.buildForm();
  }

  buildForm(): void {
    this.regionForm = this.formBuilder.group({
      description: ['', Validators.required],
      name: ['', Validators.required],
      state: [true, Validators.required]
    });
  }

  create(region?: Region): void {
    this.region = region;
    if (region) {
      this.image = region.urlImage;
      this.regionForm.patchValue(region);
    } else {
      this.image = '';
      this.buildForm();
    }
    $('#regionModal').modal('show');
  }

  save(): void {
    if (this.regionForm.valid && this.image) {
      this.loading = true;
      const regionToSave = this.regionService.build(this.regionForm.value);
      this.regionService.save(regionToSave, this.image, this.region?.id).then(() => {
        this.loading = false;
        $('#regionModal').modal('hide');
        this.buildForm();
      });
    } else {
      alert('Por favor llenar todos los campos para continuar');
    }
  }

  readImage(file: File): void {
    const reader = new FileReader();
    reader.onload = event => this.image = event.target.result.toString();
    reader.readAsDataURL(file);
  }

}
