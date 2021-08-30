import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { New } from 'src/app/interfaces/new';
import { NewService } from 'src/app/services/configuration/new.service';
import { FormValidator } from 'src/app/utils/form-validator';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  newForm: FormGroup;
  nw: New;
  newList: New[];
  image: string;
  loading: boolean;
  date;
  decisionSave = false;
  alertCreate = 'Noticia creada exitosamente';
  alertUpdate = 'Noticia actualizada correctamente';
  fields = {
    outline: 'outline',
    text: 'texto',
    title: 'título',
    reference: 'referencia'
  }

  constructor(
    private formBuilder: FormBuilder,
    private newService: NewService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loading = true;
    this.newService
      .getAll()
      .valueChanges()
      .subscribe((answer) => {
        this.newList = answer;
        this.loading = false;
      }),
      (error) => {
        console.error(error);
        Swal.fire(
          'Problema interno del server',
          'La información no pudo ser obtenida, intentelo de nuevo más tarde',
          'warning'
        );
        this.loading = false;
      };
  }

  buildForm(): void {
    let dateNow = new Date().getTime().toString();
    this.newForm = this.formBuilder.group({
      outline: ['', Validators.required],
      text: ['', Validators.required],
      title: ['', Validators.required],
      state: [true, Validators.required],
      reference: [''],
      date: [dateNow],
    });
  }

  readImage(file: File): void {
    this.decisionSave = true;
    const reader = new FileReader();
    reader.onload = (event) => (this.image = event.target.result.toString());
    reader.readAsDataURL(file);
  }

  create(nw: New): void {
    this.nw = nw;
    this.image = nw ? nw.image : '';
    nw ? this.newForm.patchValue(nw) : this.buildForm();
    $('#newModal').modal('show');
  }

  save(): void {
    if (FormValidator.validateForm(this.newForm) && this.image) {
      if (this.nw || this.validateName()) {
        this.loading = true;
        const newToSave: Partial<New> = {
          id: this.nw?.id,
          ...this.newForm.value,
        };
        this.newService
          .save(newToSave, this.image, this.decisionSave)
          .then(() => {
            this.loading = false;
            $('#newModal').modal('hide');
            this.buildForm();
            Swal.fire(
              'Buen trabajo!',
              this.decisionSave ? this.alertCreate : this.alertUpdate,
              'success'
            );
            this.decisionSave = false;
          })
          .catch(() => {
            this.loading = false;
            Swal.fire(
              'Problema interno del server',
              'La información no pudo ser guardada, intentelo de nuevo más tarde',
              'warning'
            );
          });
      } else {
        Swal.fire('Atención', `Ya existe una noticia con el mismo nombre`, 'info');
      }
    } else {
      const imageRequerid = this.image ? '' : ', imagen'
      const invalids = `${FormValidator.msgInvalidKeys(this.fields, FormValidator.getInvalids(this.newForm))}${imageRequerid}`;
      Swal.fire('Atención', `Los siguientes campos son inválidos: <br> <strong>${invalids}</strong>`, 'info');
    }
  }

  validateName(): boolean {
    const name: string = this.newForm.get('title').value;
    return !this.newList.some(region => region.title.trim().toLowerCase() === name.trim().toLowerCase());
  }

  deleteNotice(notice: New): void {
    Swal.fire({
      title: 'Confirmación',
      html: '¿Está seguro que desea eliminar esta noticia?',
      showCancelButton: true,
      confirmButtonText: `Estoy seguro`,
      cancelButtonText: 'Cancelar',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.newService.delete(notice);
        Swal.fire(
          'Buen trabajo!',
          'Noticia eliminada correctamente',
          'success'
        );
      }
    });
  }
}
