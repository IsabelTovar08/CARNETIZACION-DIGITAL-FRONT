import { Routes } from "@angular/router";
import { FormContactComponent } from "../features/organization/assignment/form-contact.component/form-contact.component";
import { EntryNavComponent } from "./entry/pages/entry-nav/entry-nav.component";
import { StartComponent } from "./entry/pages/start/start.component";


export const landingRoutes: Routes = [
  {
    path: '',
    component: EntryNavComponent,
    children: [
      { path: '', component: StartComponent,  data: { title: 'Inicio', icon: 'home' }},
      { path: 'contact', component: FormContactComponent, data: { title: 'Contacto', icon: 'call' } },
     
      {
        path: 'auth', loadChildren: () =>
          import('./auth.routers').then(m => m.authRoutes),
        data: { title: 'Ingresar', icon: 'account_circle' }
      }

    ]
  }
];
