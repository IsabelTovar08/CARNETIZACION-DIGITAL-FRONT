import { Routes } from '@angular/router'; 
import { EstructuraOrganizativaComponent } from './pages/organizational-structure/organizational-structure.component'; 
import { SucursalComponent } from './location/branches/pages/branches/branches.component'; 
import { DivisionesInternasComponent } from './structure/internal-divisions/pages/internal-divisions/internal-divisions.component'; 
import { PerfilesComponent } from './assignment/profile/pages/profile/profile.component'; 
import { JornadasComponent } from './structure/working-day/pages/working-day/working-day.component'; 
import { ListDeparmentComponent } from './location/deparment/components/list-deparment/list-deparment.component';
import { ListCitiesComponent } from './location/city/components/list-cities/list-cities.component'; 
import { ListUnidadOrganizativaComponent } from './structure/organizational-unit/components/list-organizational-unit/list-organizational-unit.component';

export const organizationalRoutes: 
Routes = [ 
    { path: 'structure', component: EstructuraOrganizativaComponent, 
        children: [
            {path: '', component: EstructuraOrganizativaComponent}, 
            { path: 'sucursales', component: SucursalComponent }, 
            { path: 'unidades-organizativas',component: ListUnidadOrganizativaComponent}, 
            { path: 'divisiones-internas', component: DivisionesInternasComponent}, 
            { path: 'perfiles', component: PerfilesComponent},
            { path: 'jornadas',component: JornadasComponent} ] }, 
    
    { path: 'location', 
        children : [ 
            { path: 'deparment', component: ListDeparmentComponent},
            { path: 'city', component: ListCitiesComponent} ] } ];