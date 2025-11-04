/// <summary>
/// Punto de entrada principal para Angular standalone.
/// Carga primero el archivo assets/env.js antes de iniciar la aplicación.
/// </summary>
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/// <summary>
/// Cargar dinámicamente env.js antes del arranque
/// </summary>
fetch('assets/env.js')
  .then(() => {
    console.log('✅ Archivo env.js cargado correctamente');
    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error(err));
  })
  .catch((err) => {
    console.error('⚠️ No se pudo cargar assets/env.js:', err);
    bootstrapApplication(AppComponent, appConfig)
      .catch((err2) => console.error(err2));
  });
