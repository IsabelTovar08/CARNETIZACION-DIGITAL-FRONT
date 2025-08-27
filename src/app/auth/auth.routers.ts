// ./auth/auth.routes.ts
import { Routes } from "@angular/router";
import { IngresarComponent } from "./entry/pages/welcome/welcome.component";
import { LoginComponent } from "./entry/pages/general-login/login/login.component";
import { ContactComponent } from "./entry/pages/contact/contact.component";
import { ForgottenPasswordComponent } from "./entry/pages/general-login/forgotten-password/forgotten-password.component";
import { RecuperationCodeComponent,  } from "./entry/pages/general-login/recuperation-code/recuperation-code.component";
import { NewPasswordComponent } from "./entry/pages/general-login/new-password/new-password.component";
import { EntryNavComponent } from "./entry/pages/entry-nav/entry-nav.component";
import { InicioComponent } from "./entry/pages/start/start.component";
import { CharacteristicsComponent } from "./entry/pages/characteristics/characteristics.component";
import { AboutCompanyComponent } from "./entry/pages/about-company/about-company.component";
import { LoginCodeComponent } from "./entry/pages/general-login/login-code/login-code.component";

export const authRoutes: Routes = [
  {
    path: '',
    component: EntryNavComponent,
    children: [
      { path: '', component: IngresarComponent },  
      { path: 'start', component: InicioComponent },
      { path: 'contact', component: ContactComponent },
      {path: 'characteristics', component: CharacteristicsComponent},
      {path: 'about', component: AboutCompanyComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgotten-password', component: ForgottenPasswordComponent },
      { path: 'recuperation-code', component: RecuperationCodeComponent },
      { path: 'login-code', component: LoginCodeComponent },
      { path: 'new-password', component: NewPasswordComponent },
    ]
  }
];
