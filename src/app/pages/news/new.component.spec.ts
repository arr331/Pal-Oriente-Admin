import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComponent } from './new.component';
import { NewService } from '../../services/configuration/new.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../../environments/environment.prod';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxImageCompressService } from 'ngx-image-compress';
import { New } from '../../interfaces/new';

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let newService: NewService;
  let nw: New;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewComponent],
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
    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    newService = TestBed.inject(NewService);
    nw = {
      id: 'id85',
      image: 'image',
      outline: 'outline',
      text: 'text',
      title: 'title',
      state: true,
      date: new Date().getTime().toString(),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getAll', () => {
    const getAllService = spyOn(newService, 'getAll').and.callThrough();
    component.ngOnInit();
    expect(getAllService).toHaveBeenCalledTimes(1);
  });

  it('saving', () => {
    component.image = 'image';
    component.newForm.controls.outline.setValue('outline');
    component.newForm.controls.text.setValue('text');
    component.newForm.controls.title.setValue('title');
    component.newForm.controls.reference.setValue('reference');
    component.newForm.controls.state.setValue(true);
    component.nw = nw;
    const newToSave: Partial<New> = { id: nw?.id, ...component.newForm.value };
    spyOn(component, 'validateName').and.returnValue(true);
    const getSaveService = spyOn(newService, 'save').and.resolveTo();
    component.save();
    expect(component.newForm.valid).toBeTruthy();
    expect(getSaveService).toHaveBeenCalledTimes(1);
  });

  it('invalidForm', () => {
    const getSaveService = spyOn(newService, 'save').and.callThrough();
    component.image = 'image';
    component.newForm.controls.outline.setValue('outline');
    component.newForm.controls.title.setValue('title');
    component.newForm.controls.state.setValue(true);
    component.save();
    expect(component.newForm.valid).toBeFalsy();
    expect(getSaveService).not.toHaveBeenCalledTimes(1);
  });
});
