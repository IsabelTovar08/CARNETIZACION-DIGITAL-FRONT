import { Routes } from '@angular/router';

import { EstructuraOrganizativaComponent } from './pages/estructura-organizativa/estructura-organizativa.component';
import { SurcursalComponent } from './location/sucursales/pages/surcursal/surcursal.component';
import { UnidadOrganizativaComponent } from './structure/unidades-organizativa/pages/unidad-organizativa/unidad-organizativa.component';
import { DivisionesInternasComponent } from './structure/divisines-Internal/pages/divisiones-internas/divisiones-internas.component';
import { PerfilesComponent } from './assignment/perfile/pages/perfiles/perfiles.component';
import { JornadasComponent } from './structure/jornada/pages/jornadas/jornadas.component';
import { ListUnidadOrganizativaComponent } from './structure/unidades-organizativa/components/list-unidad-organizativa/list-unidad-organizativa.component';

export const organizationRoutes: Routes = [
  {
    path: '',
    component: EstructuraOrganizativaComponent
  },
  {
    path: 'sucursales',
    component: SurcursalComponent
  },
  {
    path: 'unidades-organizativas',
    component: ListUnidadOrganizativaComponent
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
