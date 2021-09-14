import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionComponent } from './region.component';
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
import { RegionService } from '../../services/configuration/region.service';
import { Region } from '../../interfaces/region';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

describe('RegionComponent', () => {
  let component: RegionComponent;
  let fixture: ComponentFixture<RegionComponent>;
  let regionService: RegionService;
  let region: Region;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegionComponent],
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
    fixture = TestBed.createComponent(RegionComponent);
    component = fixture.componentInstance;
    regionService = TestBed.inject(RegionService);
    region = {
      id: '55585',
      description: 'description',
      name: 'name',
      urlImage: 'http:image',
      state: false,
    };
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit test', () => {
    const getRegiones = spyOn(regionService, 'getAll').and.callThrough();
    sessionStorage.setItem('region', 'region');
    component.ngOnInit();
    expect(getRegiones).toHaveBeenCalledTimes(1);
  });

  it('should call save method', () => {
    component.regionForm.controls.description.setValue('description');
    component.regionForm.controls.name.setValue('name');
    component.regionForm.controls.state.setValue(false);
    component.image = 'imageForm';
    component.region = region;
    spyOn(component, 'validateName').and.returnValue(true);
    const saveRegion = spyOn(regionService, 'save').and.resolveTo();
    spyOn(regionService, 'build').and.returnValue(region);
    sessionStorage.setItem('region', 'region');
    component.save();
    expect(saveRegion).toHaveBeenCalledTimes(1);
  });

  it('should call swal fire when form is invalid and image not exist', () => {
    component.regionForm.controls.description.setValue('description');
    component.regionForm.controls.state.setValue(false);

    component.save();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getHtmlContainer().textContent).toEqual('Los siguientes campos son inválidos:  nombre, imagen');
  });

  it('should call navigateByUrl', () => {
    const navigateByUrl = spyOn(router, 'navigateByUrl').and.callThrough();
    component.go('id');
    expect(sessionStorage.getItem('region')).toEqual('id');
    expect(navigateByUrl).toHaveBeenCalledWith('/municipios');
  });
});
