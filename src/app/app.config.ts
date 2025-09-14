import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { AuthBootstrap } from './core/auth/auth.bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
   {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (bootstrap: AuthBootstrap) => () => bootstrap.init(),
      deps: [AuthBootstrap],
    },
  ]
};
