import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, finalize } from 'rxjs';
import { LoangingServiceService } from './loanging-service.service';
import  Swal  from 'sweetalert2';

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
        Swal.fire('Error', error?.error?.message || 'Ocurrió un error inesperado', 'error');
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}
