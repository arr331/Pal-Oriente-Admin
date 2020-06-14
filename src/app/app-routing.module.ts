import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionInfoComponent } from './components/region-info/region-info.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { SubregionComponent } from './components/subregion/subregion.component';
import { MunicipalityComponent } from './components/configuration/municipality/municipality.component';


const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
  {path: 'inicio', component: InicioComponent},
  {path: 'info', component: RegionInfoComponent},
  {path: 'contactenos', component: ContactusComponent},
  {path: 'administration', component: AdministrationComponent},
  {path: 'subregiones', component: SubregionComponent},
  {path: 'm', component: MunicipalityComponent},
  {path: '**', redirectTo: 'inicio', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
