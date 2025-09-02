import { Routes } from "@angular/router";
import { LoginComponent } from "./entry/pages/general-login/login/login.component";
import { ForgottenPasswordComponent } from "./entry/pages/general-login/forgotten-password/forgotten-password.component";
import { RecuperationCodeComponent, } from "./entry/pages/general-login/recuperation-code/recuperation-code.component";
import { NewPasswordComponent } from "./entry/pages/general-login/new-password/new-password.component";
import { LoginCodeComponent } from "./entry/pages/general-login/login-code/login-code.component";
import { WelcomeComponent } from "./entry/pages/welcome/welcome.component";


export const authRoutes: Routes = [

  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'recuperation-code', component: RecuperationCodeComponent },
  { path: 'login-code', component: LoginCodeComponent },
  { path: 'new-password', component: NewPasswordComponent },

];
