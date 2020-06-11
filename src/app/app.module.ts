import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { MunicipalityComponent } from './components/municipality/municipality.component';
import { SiteComponent } from './components/site/site.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {NgxImageCompressService} from 'ngx-image-compress';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SliderComponent } from './components/slider/slider.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegionInfoComponent } from './components/region-info/region-info.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { LoginComponent } from './components/login/login.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { SubregionComponent } from './components/subregion/subregion.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    MunicipalityComponent,
    SiteComponent,
    HeaderComponent,
    FooterComponent,
    SliderComponent,
    InicioComponent,
    RegionInfoComponent,
    ContactusComponent,
    LoginComponent,
    AdministrationComponent,
    SubregionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireStorageModule,
    FontAwesomeModule
  ],
  providers: [NgxImageCompressService],
  bootstrap: [AppComponent]
})
export class AppModule { }
