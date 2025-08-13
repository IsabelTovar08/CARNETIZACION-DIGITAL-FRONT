import { ApplicationRef, ComponentRef, createComponent, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../../shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

   private componentRef: ComponentRef<SnackbarComponent> | null = null;

  private defaultMessages = {
    success: 'Registro almacenado exitosamente.',
    error: 'Ocurrió un error inesperado.',
    warning: 'Atención: verifica los datos.',
    info: 'Información importante.'
  };

  constructor(private injector: Injector, private appRef: ApplicationRef) { }

  show(type: 'success' | 'error' | 'warning' | 'info', message?: string) {
    try {
      // Destruye snackbar previo si existe
      if (this.componentRef) {
        this.destroy();
      }

      this.componentRef = createComponent(SnackbarComponent, {
        environmentInjector: this.appRef.injector,
        elementInjector: this.injector
      });

      this.componentRef.instance.type = type;
      this.componentRef.instance.message = message ?? this.defaultMessages[type];

      this.appRef.attachView(this.componentRef.hostView);

      const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);

      // Auto ocultar después de 4 segundos
      setTimeout(() => this.destroy(), 4000);

    } catch (error) {
      console.error('Error al intentar mostrar el snackbar:', error);
    }
  }

  private destroy() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
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
