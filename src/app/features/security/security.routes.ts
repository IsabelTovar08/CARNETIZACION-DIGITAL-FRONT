import { ListPermissionsComponent } from './permissions/components/list-permissions/list-permissions.component';
import { Routes } from '@angular/router';
import { ListPersonComponent } from './people/components/list-person/list-person.component';
import { ListUsersComponent } from './users/pages/list-users/list-users.component';
import { ListRolesComponent } from './roles/pages/list-roles/list-roles.component';
import { ListFormsComponent } from './forms/pages/list-forms/list-forms.component';
import { ListModulesComponent } from './modules/pages/list-modules/list-modules.component';
import { FormPErsonComponent } from './people/components/form-person/form-person.component';
import { PersonPageComponent } from './people/pages/person-page/person-page.component';
import { FormRoleFormPermissionComponent } from './roles/Components/form-role-form-permission/form-role-form-permission.component';
import { VistaPruebaComponent } from '../../shared/vista-prueba/vista-prueba.component';

export const securityRoutes: Routes = [
  { path: 'people', component: PersonPageComponent,
    children: [
      { path: 'create', component: FormPErsonComponent},
      // { path: 'edit/:id', component: FormPErsonComponent},
      { path: 'edit/:id', component: VistaPruebaComponent},

      { path: '', component: ListPersonComponent },

    ]
   },
  { path: 'permissions', component: ListPermissionsComponent,
    children: [
      // { path: '', component: ListPersonComponent },
      {path: 'create', component: ListPermissionsComponent}
    ]
   },
  { path: 'users', component: ListUsersComponent,
    children: [
      { path: 'createUser', component: FormPErsonComponent}
    ]
  },
  { path: 'roles', component: ListRolesComponent },
  { path: 'permission-forms', component: FormRoleFormPermissionComponent },

  { path: 'forms', component: ListFormsComponent },
  { path: 'modules', component: ListModulesComponent }
];
