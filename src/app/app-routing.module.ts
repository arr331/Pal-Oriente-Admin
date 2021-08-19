import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { MunicipalityComponent } from './pages/municipality/municipality.component';
import { LoginComponent } from './components/login/login.component';
import { NewComponent } from './pages/news/new.component';
import { SiteComponent } from './pages/site/site.component';
import { CelebrationComponent } from './pages/celebration/celebration.component';
import { RegionComponent } from './pages/region/region.component';

const redirect = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [

  { path: '', redirectTo: 'regiones', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'regiones', component: RegionComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: 'municipios', component: MunicipalityComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: 'sitios', component: SiteComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: 'celebraciones', component: CelebrationComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: 'noticias', component: NewComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: '**', redirectTo: 'regiones', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
