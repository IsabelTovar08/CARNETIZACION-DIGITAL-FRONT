import { Routes } from "@angular/router";
import { SeccionPasswordComponent } from "./seccion-password/seccion-password.component";
import { SeccionPerfilComponent } from "./seccion-perfil/seccion-perfil.component";
import { SeccionOrganizationalComponent } from "./seccion-organizational/seccion-organizational.component";
import { SeccitioncontainerComponent } from "./seccitioncontainer/seccitioncontainer.component";
import { FormPErsonComponent } from "../security/people/components/form-person/form-person.component";
import { TwoFactorToggleComponent } from "./two-factor-toggle/two-factor-toggle.component";

export const profileSeccitionRoutes: Routes = [
  {
    path: '',
    component: SeccitioncontainerComponent,
    children: [
      {
        path: '', redirectTo: 'me', pathMatch: 'full' },
      { path: 'me', component: FormPErsonComponent, data: { mode: 'edit' } },
      { path: 'organizational', component: SeccionOrganizationalComponent },
      { path: 'password', component: SeccionPasswordComponent  },
      { path: 'security', component: TwoFactorToggleComponent  }

    ]
  }
];
