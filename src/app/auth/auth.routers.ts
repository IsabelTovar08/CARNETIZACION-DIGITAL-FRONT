import { Routes } from "@angular/router";

import { LoginComponent } from "./entry/pages/loginGeneral/login/login.component";
import { ContactComponent } from "./entry/pages/contact/contact.component";
import { ForgottenPasswordComponent } from "./entry/pages/loginGeneral/forgotten-password/forgotten-password.component";
import { VerificationCodeComponent } from "./entry/pages/loginGeneral/verification-code/verification-code.component";
import { NewPasswordComponent } from "./entry/pages/loginGeneral/new-password/new-password.component";

// Componente de bienvenida
import { IngresarComponent } from "./entry/pages/ingresar/ingresar.component";

// Bienvenida (pantalla principal)
export const inicioRoutes: Routes = [
  { path: '', component: IngresarComponent }
];

// Contacto
export const contactRoutes: Routes = [
  { path: '', component: ContactComponent }
];

// Login
export const loginRoutes: Routes = [
  { path: '', component: LoginComponent }
];

// Recuperar contraseña
export const ForgottenPasswordRoutes: Routes = [
  { path: '', component: ForgottenPasswordComponent }
];

// Verificación de código
export const verificationCodeRoutes: Routes = [
  { path: '', component: VerificationCodeComponent }
];

// Nueva contraseña
export const newPasswordCodeRoutes: Routes = [
  { path: '', component: NewPasswordComponent }
];
