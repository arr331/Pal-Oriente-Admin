import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Region } from 'src/app/interfaces/region';
import { RegionService } from 'src/app/services/configuration/region.service';
import Swal from 'sweetalert2';
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
  newImage: boolean;
  loading: boolean;
  region: Region;

  constructor(private formBuilder: FormBuilder, private regionService: RegionService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.regionService.getAll().valueChanges().subscribe(answer => {
      this.regionList = answer;
      this.loading = false;
    }), error =>{
      console.error(error);
      Swal.fire('Error','Error cargando datos, intentelo más tarde','error');
      this.loading = false;
    };
    this.buildForm();
  }

  buildForm(): void {
    this.regionForm = this.formBuilder.group({
      description: ['', Validators.required],
      name: ['', Validators.required],
      state: [true, Validators.required],
      urlImage: ['']
    });
  }

  create(region?: Region): void {
    this.newImage = false;
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
      this.regionService.save(regionToSave, this.image, this.newImage, this.region?.id).then(() => {
        this.loading = false;
        $('#regionModal').modal('hide');
        Swal.fire('¡Buen trabajo!', 'Región creada exitosamente', 'success');
        this.buildForm();
      }).catch(()=>{
        Swal.fire('Problema interno del server', 'La región no pudo guardarse, intentelo de nuevo más tarde', 'warning');
      });
    } else {
      Swal.fire('Campos incompletos', 'Por favor llenar todos los campos para continuar', 'warning');
    }
  }

  readImage(file: File, newImage: boolean): void {
    this.newImage = newImage;
    const reader = new FileReader();
    reader.onload = event => this.image = event.target.result.toString();
    reader.readAsDataURL(file);
  }

  go(id: string): void {
    sessionStorage.setItem('region', id);
    this.router.navigateByUrl('/municipios');
  }
}
