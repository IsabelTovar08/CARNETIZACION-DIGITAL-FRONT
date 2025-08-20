// ./auth/auth.routes.ts
import { Routes } from "@angular/router";
import { IngresarComponent } from "./entry/pages/welcome/welcome.component";
import { LoginComponent } from "./entry/pages/general-login/login/login.component";
import { ContactComponent } from "./entry/pages/contact/contact.component";
import { ForgottenPasswordComponent } from "./entry/pages/general-login/forgotten-password/forgotten-password.component";
import { VerificationCodeComponent } from "./entry/pages/general-login/verification-code/verification-code.component";
import { NewPasswordComponent } from "./entry/pages/general-login/new-password/new-password.component";

export const authRoutes: Routes = [
  { path: '', component: IngresarComponent },     // /auth
  { path: 'login', component: LoginComponent },   // /auth/login
  { path: 'contact', component: ContactComponent },
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'verification-code', component: VerificationCodeComponent },
  { path: 'new-password', component: NewPasswordComponent },
];
