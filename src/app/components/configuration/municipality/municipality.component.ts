import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Municipality } from 'src/app/interfaces/municipality';
import { MunicipalityService } from 'src/app/services/configuration/municipality.service';
declare var $: any;

@Component({
  selector: 'app-municipality',
  templateUrl: './municipality.component.html',
  styleUrls: ['./municipality.component.scss']
})
export class MunicipalityComponent implements OnInit {
  municipalityForm: FormGroup;
  listMunicipalities: Municipality[];
  municipality: Municipality;
  isNew = true;
  url: any;
  imageBlob: any;
  item: string;

  constructor(private formBuilder: FormBuilder, private municipalityService: MunicipalityService,
    private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    this.municipalityService.getMunicipios().valueChanges().subscribe(answer => {
      this.listMunicipalities = answer;
    });
    this.buildForm();
  }

  buildForm() {
    this.municipalityForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      economy: [''],
      habitants: [''],
      history: [''],
      weather: [''],
      image: [''],
      state: [true]
    });
  }

  newMun(isNew, mpio) {
    this.item = '';
    this.isNew = isNew;
    this.municipality = mpio;
    mpio ? this.municipalityForm.patchValue(mpio) : this.buildForm();
    $('#mpioModal').modal('show');
  }

  showConfiguration(mpio: Municipality, item: string) {
    this.municipality = mpio;
    this.item = item;
  }

  async saveMpio() {
    if (this.municipalityForm.valid) {
      const mpio = this.municipalityService.buildMunicipality(this.municipalityForm.value, this.isNew ? '' : this.municipality.idMun);
      if (this.url) {
        var reader = new FileReader();
        reader.onload = async event => {
          await this.compressFile(event.target.result);
          this.municipalityService.uploadImg(this.imageBlob).then(answer => {
            mpio.image = answer;
            this.municipalityService.saveMunicipality(mpio);
            this.reset('Municipio creado')
          });
        }
        reader.readAsDataURL(this.url.target.files[0]);
      } else {
        this.municipalityService.saveMunicipality(mpio);
        this.reset('Municipio Actualizado');
      }
    } else {
      console.log('llenar');
    }
  }

  reset(msj) {
    this.url = null;
    this.imageBlob = null;
    $('#mpioModal').modal('hide');
    this.buildForm();
  }

  async compressFile(image) {
    this.imageBlob = this.dataURItoBlob((await this.imageCompress.compressFile(image, -1, 50, 50)).split(',')[1]);
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
}
