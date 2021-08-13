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
import { MunicipalityComponent } from './pages/municipality/municipality.component';
import { SiteComponent } from './pages/site/site.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './components/users/users.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NewComponent } from './pages/news/new.component';
import { CelebrationComponent } from './pages/celebration/celebration.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    MunicipalityComponent,
    SiteComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    UsersComponent,
    CelebrationComponent,
    NewComponent,
    SpinnerComponent
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
