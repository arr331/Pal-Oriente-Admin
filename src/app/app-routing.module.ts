import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { MunicipalityComponent } from './components/configuration/municipality/municipality.component';
import { LoginComponent } from './components/login/login.component';
import { NewComponent } from './components/configuration/new/new.component';

const redirect = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: 'configuracion', component: MunicipalityComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: 'configuracion/noticias', component: NewComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
