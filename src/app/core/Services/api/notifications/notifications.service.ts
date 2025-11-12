import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { NotificationDto } from '../../../Models/notifications/notifications.models';
import { ApiResponse } from '../../../Models/api-response.models';
import { ContactOrganizationRequest } from '../../../Models/organization/contact-organization';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends ApiService<any, any> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  /** Crear y enviar una notificación */
  // createAndSend(dto: NotificationDtoRequest): Observable<NotificationDto> {
  //   return this.http.post<NotificationDto>(`${this.urlBase}`, dto);
  // }

  /** Obtener notificaciones del usuario actual */
  getMyNotifications(): Observable<ApiResponse<NotificationDto[]>> {
    return this.http.get<ApiResponse<NotificationDto[]>>(`${this.urlBase}/Notifications/user`);
  }

   /** Crear y enviar una notificación */
  createAndSendNotification(dto: ContactOrganizationRequest): Observable<ApiResponse<any>> {
    return this.wrapper.handleRequest(
      this.http.post<ApiResponse<any>>(`${this.urlBase}/ContactOrganization/send-request`, dto)
    );
  }

  //  /** Crea una nueva solicitud de modificación. */
  // createModificationRequest(dto: ModificationRequestDtoRequest): Observable<ApiResponse<ModificationRequestDtoResponse>> {
  //   return this.wrapper.handleRequest(
  //     this.http.post<ApiResponse<ModificationRequestDtoResponse>>(`${this.urlBase}/ModificationRequest`, dto)
  //   );
  // }

  // /** Listar todas las solicitudes */
  // getAllModificationRequests(): Observable<ApiResponse<ModificationRequestDtoResponse[]>> {
  //   return this.wrapper.handleRequest(
  //     this.http.get<ApiResponse<ModificationRequestDtoResponse[]>>(`${this.urlBase}/ModificationRequest`)
  //   );
  // }  


  
}
