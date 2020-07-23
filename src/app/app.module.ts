import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthGuard} from '@angular/fire/auth-guard';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { MunicipalityComponent } from './components/configuration/municipality/municipality.component';
import { SiteComponent } from './components/configuration/site/site.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SliderComponent } from './components/slider/slider.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegionInfoComponent } from './components/region-info/region-info.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { LoginComponent } from './components/login/login.component';
import { SubregionComponent } from './components/subregion/subregion.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { MuniComponent } from './components/muni/muni.component';
import { SitesShowComponent } from './components/sites-show/sites-show.component';
import { ItemInfoComponent } from './components/item-info/item-info.component';
import { UsersComponent } from './components/users/users.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NoticesComponent } from './components/notices/notices.component';
import { CelebrationComponent } from './components/configuration/celebration/celebration.component';

@NgModule({
  declarations: [
    AppComponent,
    MunicipalityComponent,
    SiteComponent,
    HeaderComponent,
    FooterComponent,
    SliderComponent,
    InicioComponent,
    RegionInfoComponent,
    ContactusComponent,
    LoginComponent,
    SubregionComponent,
    MuniComponent,
    SitesShowComponent,
    ItemInfoComponent,
    UsersComponent,
    NoticesComponent,
    CelebrationComponent
  ],
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
  providers: [NgxImageCompressService, AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
