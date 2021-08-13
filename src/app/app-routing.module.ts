import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { MunicipalityComponent } from './pages/municipality/municipality.component';
import { LoginComponent } from './components/login/login.component';
import { NewComponent } from './pages/news/new.component';

const redirect = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [

  { path: '', redirectTo: 'configuracion', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'configuracion', component: MunicipalityComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: 'noticias', component: NewComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirect } },
  { path: '**', redirectTo: 'configuracion', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
