import { landingRoutes } from './auth/landing.routes';
import { parameterRoutes } from './features/parameters/parameter.routes';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas (fuera del dashboard)
  {
    path: '',
    loadChildren: () =>
      import('./auth/landing.routes').then(m => m.landingRoutes),
  },

  // Rutas privadas (dashboard)
  {
    path: 'dashboard',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboardComponent/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/pages/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent), },
      { path: 'operational', loadChildren: () => import('./features/operational/operational.routes').then(m => m.operationalRoutes), },
      { path: 'organizational', loadChildren: () => import('./features/organization/organizational.routes').then(m => m.organizationalRoutes), },
      { path: 'seguridad', loadChildren: () => import('./features/security/security.routes').then(m => m.securityRoutes), },
      { path: 'parametros', loadChildren: () => import('./features/parameters/parameter.routes').then(m => m.parameterRoutes), },
      { path: 'perfil', loadChildren: () => import('./features/ProfielUser/profileSeccition.route').then(m => m.profileSeccitionRoutes)},

    ]
  },

];
