import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { AuthBootstrap } from './core/auth/auth.bootstrap';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',            // habilita scroll al fragmento
        scrollPositionRestoration: 'enabled'   // restaura posición al navegar atrás/adelante
      })
    ),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (bootstrap: AuthBootstrap) => () => bootstrap.init(),
      deps: [AuthBootstrap],
    },
    provideNativeDateAdapter()
  ]
};
