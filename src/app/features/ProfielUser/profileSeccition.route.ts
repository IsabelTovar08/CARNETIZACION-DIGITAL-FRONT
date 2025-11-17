import { Routes } from "@angular/router";
import { SeccionPasswordComponent } from "./seccion-password/seccion-password.component";
import { SeccionPerfilComponent } from "./seccion-perfil/seccion-perfil.component";
import { SeccionOrganizationalComponent } from "./seccion-organizational/seccion-organizational.component";
import { SeccitioncontainerComponent } from "./seccitioncontainer/seccitioncontainer.component";

export const profileSeccitionRoutes: Routes = [
  {
    path: '',
    component: SeccitioncontainerComponent,
    children: [
      {
        path: '', redirectTo: 'me', pathMatch: 'full' },
      { path: 'me', component: SeccionPerfilComponent },
      { path: 'organizational', component: SeccionOrganizationalComponent },
      { path: 'password', component: SeccionPasswordComponent  }
    ]
  }
];
