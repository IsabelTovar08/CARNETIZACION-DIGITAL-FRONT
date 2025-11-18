import { Injectable } from '@angular/core';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ModificationMessageDto {
  message?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ModificationRequestService extends ApiService<any, any> {

   constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

   /// <summary>
  /// Aprueba la solicitud con un mensaje opcional.
  /// </summary>
  approve(id: number, message?: string): Observable<any> {
    const body = { message };
    return this.wrapper.handleRequest(this.http.post(`${this.urlBase}/ModificationRequest/approve/${id}`, body));
  }

  /// <summary>
  /// Rechaza la solicitud con un mensaje opcional.
  /// </summary>
  reject(id: number, message?: string): Observable<any> {
    const body = { message };
    return this.wrapper.handleRequest(this.http.post(`${this.urlBase}/ModificationRequest/reject/${id}`, body));
  }
}
