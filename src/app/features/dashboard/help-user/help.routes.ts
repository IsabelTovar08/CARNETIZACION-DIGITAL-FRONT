import { Routes } from '@angular/router';

export const helpRoutes: Routes = [
  {
    path: '',
    title: 'Ayuda',
    loadComponent: () =>
      import('./components/help-layout/help-user-container.component')
        .then(m => m.HelpUserContainerComponent),
  },
];
