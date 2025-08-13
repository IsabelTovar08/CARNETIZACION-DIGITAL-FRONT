import { Routes } from "@angular/router";
import { StatusListComponent } from "./status/status-list/status-list.component";

export const parameterRoutes: Routes = [
  { path: 'status', component: StatusListComponent },
  // { path: 'roles', component: ListRolesComponent },

];
