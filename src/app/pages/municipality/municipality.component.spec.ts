import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipalityComponent } from './municipality.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../../environments/environment.prod';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MunicipalityService } from '../../services/configuration/municipality.service';
import Swal from 'sweetalert2';
import { Municipality } from '../../interfaces/municipality';
import { Router } from '@angular/router';

describe('MunicipalityComponent', () => {
  let component: MunicipalityComponent;
  let fixture: ComponentFixture<MunicipalityComponent>;
  let municipalityService: MunicipalityService;
  let municipality: Municipality;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MunicipalityComponent],
      imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        AngularFireStorageModule,
        FontAwesomeModule,
        PerfectScrollbarModule,
      ],
      providers: [AngularFireAuthGuard, NgxImageCompressService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipalityComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    municipalityService = TestBed.inject(MunicipalityService);
    municipality = {
      celebrations: [],
      description: 'descripcion',
      economy: 'economia',
      habitants: 'habitantes',
      history: 'historia',
      idMun: 'idmun',
      image: 'image',
      name: 'name',
      sites: [],
      state: true,
      weather: 'clima',
      reference: 'referencia',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit test when region exist', () => {
    const getMunicipios = spyOn(
      municipalityService,
      'getMunicipios'
    ).and.callThrough();
    sessionStorage.setItem('region', 'region');
    component.ngOnInit();
    expect(getMunicipios).toHaveBeenCalledWith(component.region);
  });

  it('ngOnInit test when region not exist', () => {
    sessionStorage.removeItem('region');
    component.ngOnInit();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getTitle().textContent).toEqual('Advertencia');
  });

  it('showConfiguration when item is equal to site', () => {
    const navigateByUrl = spyOn(router, 'navigateByUrl').and.callThrough();
    component.showConfiguration(municipality, 'site');
    expect(navigateByUrl).toHaveBeenCalledWith('/sitios');
  });

  it('showConfiguration when item is not equal to site', () => {
    const navigateByUrl = spyOn(router, 'navigateByUrl').and.callThrough();
    component.showConfiguration(municipality, 'celebration');
    expect(navigateByUrl).toHaveBeenCalledWith('/celebraciones');
  });

  it('should called throw Error', () => {
    component.throwError('mensaje', 'error');
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getTitle().textContent).toEqual('Problema interno del server');
    expect(component.loading).toBeFalse();
  });

  it('should show a error message when form is invalid', () => {
    component.municipalityForm.controls.name.setValue('name');
    component.municipalityForm.controls.description.setValue('description');
    component.municipalityForm.controls.economy.setValue('economy');
    component.municipalityForm.controls.habitants.setValue('habitants');
    component.saveMpio();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getTitle().textContent).toEqual('Campos incompletos');
  });

  it('should save municipality when url not exist', () => {
    const saveMunicipality = spyOn(
      municipalityService,
      'saveMunicipality'
    ).and.callThrough();
    component.municipalityForm.controls.name.setValue('name');
    component.municipalityForm.controls.description.setValue('description');
    component.municipalityForm.controls.economy.setValue('economy');
    component.municipalityForm.controls.habitants.setValue('habitants');
    component.municipalityForm.controls.history.setValue('history');
    component.municipalityForm.controls.weather.setValue('weather');
    component.municipalityForm.controls.reference.setValue('reference');
    component.saveMpio();
    expect(saveMunicipality).toHaveBeenCalledTimes(1);
  });
});
