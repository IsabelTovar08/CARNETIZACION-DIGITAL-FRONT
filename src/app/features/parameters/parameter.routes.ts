import { Routes } from "@angular/router";
import { StatusListComponent } from "./status/status-list/status-list.component";
import { ListTypeCategoryComponent } from "./status/type-category/list-type-category/list-type-category.component";

export const parameterRoutes: Routes = [
  { path: 'status', component: StatusListComponent },
  { path: 'types-category', component: ListTypeCategoryComponent },

];
