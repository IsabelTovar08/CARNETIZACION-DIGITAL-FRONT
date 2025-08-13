import { Routes } from "@angular/router";

import { L } from "@angular/cdk/keycodes";
import { LoginComponent } from "./entry/pages/loginGeneral/login/login.component";
import { InicioComponent } from "./entry/pages/inicio/inicio.component";
import { ContactComponent } from "./entry/pages/contact/contact.component";
import { ForgottenPasswordComponent } from "./entry/pages/loginGeneral/forgotten-password/forgotten-password.component";
import { VerificationCodeComponent } from "./entry/pages/loginGeneral/verification-code/verification-code.component";
import { NewPasswordComponent } from "./entry/pages/loginGeneral/new-password/new-password.component";



export const inicioRoutes: Routes = [
  { path: '', component: InicioComponent }
];

export const contactRoutes: Routes = [
  { path: '', component: ContactComponent }
];

export const loginRoutes: Routes = [
    {path: '',component: LoginComponent}
];

export const ForgottenPasswordRoutes: Routes = [
    {path: '', component: ForgottenPasswordComponent}
];

export const verificationCodeRoutes: Routes = [
  {path: '',component: VerificationCodeComponent}
];
export const newPasswordCodeRoutes: Routes = [
  {path: '', component: NewPasswordComponent}
];
