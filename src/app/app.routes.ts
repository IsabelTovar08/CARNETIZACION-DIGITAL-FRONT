import { parameterRoutes } from './features/parameters/parameter.routes';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { IngresarComponent } from './auth/entry/pages/ingresar/ingresar.component';

export const routes: Routes = [
  // Rutas públicas (fuera del dashboard)

  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routers').then(m => m.authRoutes),
  },
  // Rutas privadas (dashboard)
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
            path: 'estructura-organizativa',
            loadChildren: () =>
              import('./features/organization/organizational.routes').then(m => m.organizationalRoutes),
          },
          {
            path: 'seguridad',
            loadChildren: () =>
              import('./features/security/security.routes').then(m => m.securityRoutes),
          },
          {
            path: 'parametros',
            loadChildren: () =>
              import('./features/parameters/parameter.routes').then(m => m.parameterRoutes),
          },
          {
            path: 'organizational',
            loadChildren: () =>
              import('./features/organization/organizational.routes').then(m => m.organizationalRoutes),
          }
    ]
  },
];
