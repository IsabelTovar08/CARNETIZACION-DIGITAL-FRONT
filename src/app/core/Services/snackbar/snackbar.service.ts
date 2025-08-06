import { ApplicationRef, createComponent, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../../shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private injector: Injector, private appRef: ApplicationRef) { }


  private defaultMessages = {
    success: 'Registro almacenado éxitosamente.',
    error: 'Ocurrió un error inesperado.',
    warning: 'Atención: verifica los datos.',
    info: 'Información importante.'
  };


  show(type: 'success' | 'error' | 'warning' | 'info', message?: string) {
    try {
      const componentRef = createComponent(SnackbarComponent, {
        environmentInjector: this.appRef.injector,
        elementInjector: this.injector
      });

      componentRef.instance.type = type;
      componentRef.instance.message = message || this.defaultMessages[type];

      this.appRef.attachView(componentRef.hostView);

      const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    } catch (error) {
      // Captura cualquier error inesperado al mostrar el snackbar
      console.error('Error al intentar mostrar el snackbar:', error);
    }
  }

  showSuccess(message?: string) {
    this.show('success', message);
  }

  showError(message?: string) {
    this.show('error', message);
  }

  showWarning(message?: string) {
    this.show('warning', message);
  }

  showInfo(message?: string) {
    this.show('info', message);
  }
}
