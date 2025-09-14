import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas (fuera del dashboard)
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.routers').then(m => m.loginRoutes),
  },
  {
    path: 'forgotten-password',
    loadChildren: () =>
      import('./auth/auth.routers').then(m => m.ForgottenPasswordRoutes),
  },
  {
    path: 'verification-code',
    loadChildren:() =>
      import('./auth/auth.routers').then(m => m.verificationCodeRoutes),
  },
  {
    path: 'inicio',
    loadChildren: () =>
      import('./auth/auth.routers').then(m => m.inicioRoutes),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./auth/auth.routers').then(m => m.contactRoutes),
  },

  //Rutas privadas (dashboard)
  {
    path: 'dashboard',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboardComponent/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent),
      },
      {
        path: 'security',
        loadChildren: () =>
          import('./features/security/security.routes').then(m => m.securityRoutes),
      },
      {
        path: 'organizational',
        loadChildren: () =>
          import('./features/organizational/organizational.routes').then(m => m.organizationalRoutes),
      }
    ]
  },

  // Redirección por defecto
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
