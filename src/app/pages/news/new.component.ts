import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { New } from 'src/app/interfaces/new';
import { NewService } from 'src/app/services/configuration/new.service';
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

  constructor(private formBuilder: FormBuilder, private newService: NewService) { }

  ngOnInit(): void {
    this.buildForm();
    this.loading = true;
    this.newService.getAll().valueChanges().subscribe(answer => {
      this.newList = answer;
      this.loading = false;
    });
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
      this.newService.save(newToSave, this.image).then(() => {
        this.loading = false;
        $('#newModal').modal('hide');
        this.buildForm();
      });
    } else {
      alert('Por favor llenar todos los campos para continuar');
    }
  }
}
