import { Routes } from '@angular/router';
import { ListPersonComponent } from './people/pages/list-person/list-person.component';

export const securityRoutes: Routes = [
  {
    path: 'people',
    component: ListPersonComponent,
  }
];
