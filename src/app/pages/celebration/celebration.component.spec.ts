import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CelebrationComponent } from './celebration.component';
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
import { GalleryService } from '../../services/configuration/gallery.service';
import { Celebration } from '../../interfaces/celebration';
import { Activity } from '../../interfaces/activity';
import Swal from 'sweetalert2';
import { CelebrationService } from '../../services/configuration/celebration.service';

describe('CelebrationComponent', () => {
  let component: CelebrationComponent;
  let fixture: ComponentFixture<CelebrationComponent>;
  let galleryService: GalleryService;
  let celebrationService: CelebrationService;
  let celebration: Celebration;
  let activity: Activity;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CelebrationComponent],
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
    fixture = TestBed.createComponent(CelebrationComponent);
    galleryService = TestBed.inject(GalleryService);
    celebrationService = TestBed.inject(CelebrationService);
    celebration = {
      activities: [activity, activity],
      description: 'description',
      idCelebration: 'idCelebration',
      image: 'image',
      name: 'name',
      reference: 'reference',
      state: true,
    };
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should called uploadGallery', () => {
    const galleryUploadService = spyOn(
      galleryService,
      'uploadGalery'
    ).and.resolveTo();
    component.images = ['image1', 'image2'];
    component.idMun = 'idMun';
    component.celebration = celebration;
    component.region = 'region';
    component.saveGallery();
    expect(galleryUploadService).toHaveBeenCalledWith(
      component.region,
      component.images,
      component.idMun,
      component.celebration.idCelebration,
      'CELEBRATIONS'
    );
  });

  it('should called throw Error', () => {
    component.throwError('mensaje');
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getTitle().textContent).toEqual('Problema interno del servidor');
    expect(component.loading).toBeFalse();
  });

  it('should called show activities', () => {
    component.showActivities(celebration);
    expect(component.listActivity.length).toEqual(2);
  });

  it('onInit test when idMun and IdRegion exists', () => {
    sessionStorage.setItem('idMun', 'idMun');
    sessionStorage.setItem('region', 'region');
    let celebrations = [celebration, celebration];
    component.listCelebration = [];
    sessionStorage.setItem('celebrations', JSON.stringify(celebrations));
    component.ngOnInit();
    expect(component.listCelebration.length).toEqual(2);
  });

  it('onInit test when idMun and IdRegion not exists', () => {
    sessionStorage.removeItem('idMun');
    sessionStorage.removeItem('region');
    let celebrations = [celebration, celebration];
    component.listCelebration = [];
    sessionStorage.setItem('celebrations', JSON.stringify(celebrations));
    component.ngOnInit();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getTitle().textContent).toEqual('Atención');
  });

  it('should call addCelebration method and reset method when url not exist', () => {
    const addCelebration = spyOn(
      celebrationService,
      'addCelebration'
    ).and.stub();
    spyOn(component, 'validateName').and.returnValue(true);
    component.celebration = celebration;
    component.image = 'image';
    component.celebrationForm.controls.name.setValue('name');
    component.celebrationForm.controls.description.setValue('description');
    component.idMun = 'idMun';
    spyOn(component, 'reset');
    component.saveCelebration();
    expect(addCelebration).toHaveBeenCalledTimes(1);
    expect(component.reset).toHaveBeenCalledTimes(1);
  });

  // it('should call addCelebration method test', () => {
  //   const addCelebration = spyOn(
  //     celebrationService,
  //     'addCelebration'
  //   ).and.stub();

  //   component.celebrationForm.controls.name.setValue('name');
  //   component.celebrationForm.controls.description.setValue('description');
  //   component.idMun = 'idMun';
  //   component.url = 'url';
  //   spyOn(component, 'reset');
  //   const uploadImg = spyOn(celebrationService, 'uploadImg').and.resolveTo();
  //   component.saveCelebration();
  //   expect(uploadImg).toHaveBeenCalledTimes(1);
  // });

  it('should show message error when form is invalid', () => {
    component.celebrationForm.controls.name.setValue('name');
    component.celebrationForm.controls.reference.setValue('reference');
    component.celebrationForm.controls.image.setValue('image');
    component.image = 'image';
    component.saveCelebration();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getHtmlContainer().textContent).toEqual('Los siguientes campos son inválidos:  descripción');
  });

  it('should call addActivity method and reset method when url not exist', () => {
    const addCelebration = spyOn(celebrationService, 'addActivity').and.stub();
    spyOn(component, 'validateNameActivity').and.returnValue(true);
    component.activityForm.controls.name.setValue('name');
    component.celebration = celebration;
    component.idMun = 'idMun';
    component.image = 'image';
    component.activity = activity;
    spyOn(component, 'reset');
    component.saveActivity();
    expect(addCelebration).toHaveBeenCalledTimes(1);
    expect(component.reset).toHaveBeenCalledTimes(1);
  });

  it('should show message error when activityForm is invalid', () => {
    component.image = 'image';
    component.saveActivity();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getHtmlContainer().textContent).toEqual('Los siguientes campos son inválidos:  nombre');
  });
});
