/// <summary>
/// Arranque principal de Angular standalone.
/// Carga y ejecuta el archivo assets/env.js antes de iniciar la app.
/// </summary>
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

function loadEnvJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'assets/env.js';
    script.onload = () => {
      console.log('✅ env.js cargado correctamente');
      console.log('🌍 API_BASE_URL =', (window as any)['env']?.API_BASE_URL);
      resolve();
    };
    script.onerror = (err) => {
      console.error('❌ Error cargando env.js', err);
      reject(err);
    };
    document.head.appendChild(script);
  });
}

loadEnvJs()
  .then(() => {
    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error('❌ Error en bootstrap:', err));
  })
  .catch(() => {
    // Si por alguna razón no se carga el env.js, igual se arranca Angular
    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error('❌ Error en bootstrap (sin env):', err));
  });
