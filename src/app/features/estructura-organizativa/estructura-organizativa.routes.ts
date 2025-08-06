import { Routes } from '@angular/router';
import { EstructuraOrganizativaComponent } from './organizativa/estructura-organizativa.component';

export const estructuraOrganizativaRoutes: Routes = [
  {
    path: 'organizativa',
    component: EstructuraOrganizativaComponent,
    title: 'Estructura Organizativa'
  }
];
