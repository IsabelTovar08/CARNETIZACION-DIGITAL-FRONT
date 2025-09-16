import { Routes } from '@angular/router';

export const helpRoutes: Routes = [
  {
    path: '',
    title: 'Ayuda',
    loadComponent: () =>
      import('./help-user/help-user-container/help-user-container.component')
        .then(m => m.HelpUserContainerComponent),
  },
];
