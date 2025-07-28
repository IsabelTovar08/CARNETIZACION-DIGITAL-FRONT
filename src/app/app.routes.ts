import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboardComponent/dashboard.component').then(m => m.DashboardComponent),
    children: [
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full',
      // },
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
      },
      {
        path: 'login',
        loadChildren: () =>
           import('./features/auth/auth.routes').then(m => m.loginRoutes),
      },
      {
        path : 
      },
      {
        path: 'inicio',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(m => m.inicioRoutes),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/auth/auth.routes').then(m => m.contactRoutes),
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }
];
