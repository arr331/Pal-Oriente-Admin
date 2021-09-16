import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteComponent } from './site.component';
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
import { SiteService } from '../../services/configuration/site.service';
import { Site } from '../../interfaces/site';
import Swal from 'sweetalert2';
declare const $: any;

describe('SiteComponent', () => {
  let component: SiteComponent;
  let fixture: ComponentFixture<SiteComponent>;
  let galleryService: GalleryService;
  let siteService: SiteService;
  let site: Site;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SiteComponent],
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
    fixture = TestBed.createComponent(SiteComponent);
    component = fixture.componentInstance;
    galleryService = TestBed.inject(GalleryService);
    siteService = TestBed.inject(SiteService);
    site = {
      description: 'description',
      idSite: 'id1',
      image: 'image',
      name: 'name',
      state: true,
      x: '588555',
      y: '-7585555',
      reference: 'reference',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should called uploadGallery', () => {
    component.images = ['image1', 'image2'];
    component.idMun = 'idMun';
    component.region = 'region';
    component.site = site;
    const galleryUploadService = spyOn(
      galleryService,
      'uploadGalery'
    ).and.resolveTo();
    component.saveGallery();
    expect(galleryUploadService).toHaveBeenCalledWith(
      component.region,
      component.images,
      component.idMun,
      component.site.idSite,
      'SITES'
    );
  });

  it('should call addSite method and reset method when url not exist', () => {
    const addSite = spyOn(siteService, 'addSite').and.stub();
    spyOn(component, 'validateName').and.returnValue(true);
    component.siteForm.controls.name.setValue('name');
    component.siteForm.controls.description.setValue('description');
    component.siteForm.controls.x.setValue('x');
    component.siteForm.controls.y.setValue('y');
    component.siteForm.controls.reference.setValue('reference');
    component.image = 'image';
    component.idMun = 'idMun';
    component.site = site;
    spyOn(component, 'reset');
    component.saveSite();
    expect(addSite).toHaveBeenCalledTimes(1);
    expect(component.reset).toHaveBeenCalledTimes(1);
  });

  it('should call swal fire when form is invalid', () => {
    component.siteForm.controls.name.setValue('name');
    component.siteForm.controls.description.setValue('description');
    component.siteForm.controls.y.setValue('y');
    component.idMun = 'idMun';
 
    component.saveSite();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getHtmlContainer().textContent).toEqual('Los siguientes campos son inválidos:  coordenada x, imagen');
  });

  it('should called getAllImages method', () => {
    const getAllImages = spyOn(
      galleryService,
      'getAllImages'
    ).and.callThrough();
    component.idMun = 'idMun';
    component.region = 'region';
    component.openGallery(site);
    expect(getAllImages).toHaveBeenCalledWith(
      component.region,
      component.idMun,
      component.site.idSite,
      'SITES'
    );
  });

  // it('should called reset method', () => {
  //   spyOn($, '#siteModal').and.resolveTo();
  //   component.idMun = 'idMun';
  //   component.reset(site);
  //   expect(component.siteList.length).toBeGreaterThanOrEqual(1);
  // });

  it('onInit test when idMun and IdRegion exists', () => {
    sessionStorage.setItem('idMun', 'idMun');
    sessionStorage.setItem('region', 'region');
    const sites = [site, site];
    component.siteList = [];
    sessionStorage.setItem('sites', JSON.stringify(sites));
    component.ngOnInit();
    expect(component.siteList.length).toEqual(2);
  });

  it('onInit test when idMun and IdRegion not exists', () => {
    sessionStorage.removeItem('idMun');
    sessionStorage.removeItem('region');
    const sites = [site, site];
    component.siteList = [];
    sessionStorage.setItem('sites', JSON.stringify(sites));
    component.ngOnInit();
    expect(Swal.isVisible()).toBeTruthy();
    expect(Swal.getTitle().textContent).toEqual('Advertencia');
  });
});
