import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, finalize } from 'rxjs';
import { LoangingServiceService } from './loanging-service.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceWrapperService {

  constructor(private loadingService: LoangingServiceService) { }

  handleRequest<T>(observable: Observable<T>): Observable<T> {
    this.loadingService.show();
    return observable.pipe(
      catchError(error => {
        console.error('HTTP Error:', error);

        const backendErrors = error?.error?.errors;

        let message = 'Ocurrió un error inesperado';

        // Si vienen errores de validación
        if (backendErrors && typeof backendErrors === 'object') {
          message = Object.keys(backendErrors)
            .map(key => `<b>${key}</b>: ${backendErrors[key].join(', ')}`)
            .join('<br>');
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: message
        });

        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );

  }
}
