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
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './components/users/users.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CelebrationComponent } from './components/configuration/celebration/celebration.component';
import { NewComponent } from './components/configuration/new/new.component';

@NgModule({
  declarations: [
    AppComponent,
    MunicipalityComponent,
    SiteComponent,
    HeaderComponent,
    FooterComponent,
    InicioComponent,
    LoginComponent,
    UsersComponent,
    CelebrationComponent,
    NewComponent
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
