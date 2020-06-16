import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { RegionInfoComponent } from './components/region-info/region-info.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { SubregionComponent } from './components/subregion/subregion.component';
import { MunicipalityComponent } from './components/configuration/municipality/municipality.component';
import { MuniComponent } from './components/muni/muni.component';
import { SitesShowComponent } from './components/sites-show/sites-show.component';
import { LoginComponent } from './components/login/login.component';

const redirect = () => redirectUnauthorizedTo(['inicio']);

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'configuracion', component: MunicipalityComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: 'info', component: RegionInfoComponent },
  { path: 'contactenos', component: ContactusComponent },
  { path: 'administration', component: AdministrationComponent },
  { path: 'subregiones', component: SubregionComponent },
  { path: 'subregiones/altiplano', component: MuniComponent },
  { path: 'subregiones/altiplano/mun:sites', component: SitesShowComponent },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
