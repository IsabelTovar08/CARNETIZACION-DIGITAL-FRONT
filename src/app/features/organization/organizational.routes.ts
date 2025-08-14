import { Routes } from '@angular/router';

import { EstructuraOrganizativaComponent } from './pages/estructura-organizativa/estructura-organizativa.component';
import { SucursalComponent } from './location/sucursales/pages/surcursal/surcursal.component';
import { UnidadOrganizativaComponent } from './structure/unidades-organizativa/pages/unidad-organizativa/unidad-organizativa.component';
import { DivisionesInternasComponent } from './structure/divisines-Internal/pages/divisiones-internas/divisiones-internas.component';
import { PerfilesComponent } from './assignment/perfile/pages/perfiles/perfiles.component';
import { JornadasComponent } from './structure/jornada/pages/jornadas/jornadas.component';
import { ListUnidadOrganizativaComponent } from './structure/unidades-organizativa/components/list-unidad-organizativa/list-unidad-organizativa.component';
import { ListDeparmentComponent } from './location/deparment/components/list-deparment/list-deparment.component';

export const organizationalRoutes: Routes = [
  {
    path: 'structure',
    component: EstructuraOrganizativaComponent,
    children: [
      { path: 'sucursales', component: SucursalComponent },
      { path: 'unidades-organizativas',component: ListUnidadOrganizativaComponent},
      { path: 'divisiones-internas', component: DivisionesInternasComponent},
      { path: 'perfiles', component: PerfilesComponent},
      { path: 'jornadas',component: JornadasComponent}
    ]
  },
  { path: 'location',
    children : [
      { path: 'deparment', component: ListDeparmentComponent}
    ]
   }

];
