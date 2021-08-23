import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
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

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersComponent ],
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
        PerfectScrollbarModule
      ],
      providers: [AngularFireAuthGuard, NgxImageCompressService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid', () => {
    component.logInForm.controls.email.setValue('email');
    component.logInForm.controls.nameUser.setValue('nameUser');
    component.ngOnInit();
    expect(component.logInForm.valid).toBeFalsy();
  });

  it('form is valid', () => {
    component.ngOnInit();
    component.logInForm.controls.email.setValue('email');
    component.logInForm.controls.nameUser.setValue('nameUser');
    component.logInForm.controls.lastUser.setValue('lastUser');
    component.logInForm.controls.password.setValue('password');
    expect(component.logInForm.valid).toBeTruthy();
  });
});
