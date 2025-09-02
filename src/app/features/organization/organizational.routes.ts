import { Routes } from '@angular/router';
import { EstructuraOrganizativaComponent } from './pages/organizational-structure/organizational-structure.component';
import { SucursalComponent } from './location/branches/pages/branches/branches.component';
import { DivisionesInternasComponent } from './structure/internal-divisions/pages/internal-divisions/internal-divisions.component';
import { PerfilesComponent } from './assignment/profile/pages/profile/profile.component';
import { JornadasComponent } from './structure/working-day/components/working-day/working-day.component';
import { ListDeparmentComponent } from './location/deparment/components/list-deparment/list-deparment.component';
import { ListCitiesComponent } from './location/city/components/list-cities/list-cities.component';
import { ListOrganizationalUnitComponent } from './structure/organizational-unit/components/list-organizational-unit/list-organizational-unit.component';

export const organizationalRoutes:
Routes = [
    { path: 'structure',
        children: [
            { path: '', component: EstructuraOrganizativaComponent },
            { path: 'branch', component: SucursalComponent },
            { path: 'unit',component: ListOrganizationalUnitComponent
             },
            { path: 'unit/:id/internal-division', component: DivisionesInternasComponent},

            { path: 'internal-division', component: DivisionesInternasComponent},
            { path: 'profile', component: PerfilesComponent},
            { path: 'schedule',component: JornadasComponent} ] },

    { path: 'location',
        children : [
            { path: 'department', component: ListDeparmentComponent},
            { path: 'municipality', component: ListCitiesComponent} ] } ];
