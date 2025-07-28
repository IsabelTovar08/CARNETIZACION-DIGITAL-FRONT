import { Routes } from "@angular/router";
import { LoginComponent } from "./entry/pages/loginGeneral/login/login.component";
import { InicioComponent } from "./entry/pages/inicio/inicio.component";
import { ContactComponent } from "./entry/pages/contact/contact.component";

export const loginRoutes: Routes = [
  { path: '', component: LoginComponent }
];

export const inicioRoutes: Routes = [
  { path: '', component: InicioComponent }
];

export const contactRoutes: Routes = [
  { path: '', component: ContactComponent }
];