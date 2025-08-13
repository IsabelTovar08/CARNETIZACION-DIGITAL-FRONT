import { Routes } from '@angular/router';

import { EstructuraOrganizativaComponent } from './pages/estructura-organizativa/estructura-organizativa.component';
import { SucursalComponent } from './location/sucursales/pages/surcursal/surcursal.component';
import { UnidadOrganizativaComponent } from './structure/unidades-organizativa/pages/unidad-organizativa/unidad-organizativa.component';
import { DivisionesInternasComponent } from './structure/divisines-Internal/pages/divisiones-internas/divisiones-internas.component';
import { PerfilesComponent } from './assignment/perfile/pages/perfiles/perfiles.component';
import { JornadasComponent } from './structure/jornada/pages/jornadas/jornadas.component';

export const organizationRoutes: Routes = [
  {
    path: '',
    component: EstructuraOrganizativaComponent
  },
  {
  path: 'sucursales',
  component: SucursalComponent
}
,
  {
    path: 'unidades-organizativas',
    component: UnidadOrganizativaComponent
  },
  {
    path: 'divisiones-internas',
    component: DivisionesInternasComponent
  },
  {
    path: 'perfiles',
    component: PerfilesComponent
  },
  {
    path: 'jornadas',
    component: JornadasComponent
  }
];
