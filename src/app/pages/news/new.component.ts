import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { New } from 'src/app/interfaces/new';
import { NewService } from 'src/app/services/configuration/new.service';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  newForm: FormGroup;
  nw: New;
  newList: New[];
  image: string;
  loading: boolean;
  decisionSave = false;
  alertCreate = 'Noticia creada exitosamente';
  alertUpdate = 'Noticia actualizada correctamente';

  constructor(private formBuilder: FormBuilder, private newService: NewService) { }

  ngOnInit(): void {
    this.buildForm();
    this.loading = true;
    this.newService.getAll().valueChanges().subscribe(answer => {
      this.newList = answer;
      this.loading = false;
    }), error => {
      console.error(error);
      Swal.fire('Problema interno del server','La información no pudo ser obtenida, intentelo de nuevo más tarde','warning');
      this.loading = false;
    };
  }

  buildForm(): void {
    this.newForm = this.formBuilder.group({
      outline: ['', Validators.required],
      text: ['', Validators.required],
      title: ['', Validators.required],
      state: [true, Validators.required]
    });
  }

  readImage(file: File): void {
    this.decisionSave = true;
    const reader = new FileReader();
    reader.onload = event => this.image = event.target.result.toString();
    reader.readAsDataURL(file);
  }

  create(nw: New): void {
    this.nw = nw;
    this.image = nw ? nw.image : '';
    nw ? this.newForm.patchValue(nw) : this.buildForm();
    $('#newModal').modal('show');
  }

  save(): void {
    if (this.newForm.valid && this.image) {
      this.loading = true;
      const newToSave: Partial<New> = { id: this.nw?.id, ...this.newForm.value };
      this.newService.save(newToSave, this.image, this.decisionSave).then(() => {
        this.loading = false;
        $('#newModal').modal('hide');
        this.buildForm();
        Swal.fire('Buen trabajo!', this.decisionSave ? this.alertCreate: this.alertUpdate,'success');
        this.decisionSave = false;
      }) .catch (() => {
        this.loading= false;
        Swal.fire('Problema interno del server','La información no pudo ser guardada, intentelo de nuevo más tarde','warning');
      });
    } else {
      Swal.fire('Campos incompletos','Por favor llenar todos los campos para continuar', 'warning');
    }
  }

}
