import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../Models/api-response.models';
import { CreateEventRequest, EventDtoRequest, SelectOption, FinalizeEventResponse } from '../../../Models/operational/event.model';
import { EventsByType, EventTopAttendance } from '../../../Models/organization/cards-dashboard.models';
import { ApiService } from '../api.service';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';


@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService<any, any> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  // Crear evento con accesos y audiencias
  public createEvent(dto: CreateEventRequest): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(
      `${this.urlBase}/Event/create-with-access-points`,
      dto,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Actualizar evento
  public updateEvent(dto: EventDtoRequest): Observable<ApiResponse<{ id: number }>> {
    return this.http.put<ApiResponse<{ id: number }>>(
      `${this.urlBase}/Event/update-full`,
      dto,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

// Eliminar evento
  public deleteEvent(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.urlBase}/Event/${id}`);
  }


// Obtener todos los eventos con información completa (audiencias, accesos, etc.)
public getAllEventsFull(): Observable<ApiResponse<any>> {
  return this.wrapper.handleRequest(this.http.get<ApiResponse<any>>(
    `${this.urlBase}/Event/list-full`,
    { headers: { 'Content-Type': 'application/json' } }
  ));
}






  // Obtener puntos de acceso por sucursal (Branch)
  public getAccessPointsByBranch(branchId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${environment.API_BASE_URL}/api/AccessPoint/by-branch/${branchId}`
    );
  }

  // Obtener tipos de puntos de acceso
  getAccessPointTypes() {
    return this.http.get<ApiResponse<SelectOption[]>>(
      `${environment.API_BASE_URL}/api/AccessPoint`
    );
  }

  // Obtener detalles completos de un evento
  public getEventDetails(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.urlBase}/Event/details/${id}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Gets para buscar el perfil, unidad organizativa y diviciones internas

  // Obtener perfiles disponibles
  getProfiles(): Observable<ApiResponse<SelectOption[]>> {
    return this.http.get<ApiResponse<SelectOption[]>>(`${this.urlBase}/Profile`);
  }

  // Obtener unidades organizativas
  getOrganizationalUnits(): Observable<ApiResponse<SelectOption[]>> {
    return this.http.get<ApiResponse<SelectOption[]>>(`${this.urlBase}/OrganizationalUnit`);
  }

  // Obtener divisiones internas
  getInternalDivisions(): Observable<ApiResponse<SelectOption[]>> {
    return this.http.get<ApiResponse<SelectOption[]>>(`${this.urlBase}/InternalDivision`);
  }

  // Dashboard: Obtener eventos por tipo
  getEventsByType(): Observable<ApiResponse<EventsByType[]>> {
    console.log('🔧 EventService: getEventsByType() llamado');
    console.log('🔗 EventService: URL completa:', `${this.urlBase}/Event/types/count`);
    
    return this.http.get<ApiResponse<EventsByType[]>>(`${this.urlBase}/Event/types/count`);
  }

  // Dashboard: Obtener top eventos con asistencia por tipo
  getTopAttendanceByType(typeId: number, top: number = 5): Observable<EventTopAttendance[]> {
    console.log('🔧 EventService: getTopAttendanceByType() llamado con typeId:', typeId, 'top:', top);
    console.log('🔗 EventService: URL completa:', `${this.urlBase}/Event/top-attendance-by-type/${typeId}?top=${top}`);

    return this.http.get<EventTopAttendance[]>(
      `${this.urlBase}/Event/top-attendance-by-type/${typeId}?top=${top}`
    );
  }

  // Asignar supervisor a un evento
  assignSupervisor(eventId: number, supervisorUserIds: number[]): Observable<ApiResponse<{ id: number }>> {
    return this.http.put<ApiResponse<{ id: number }>>(
      `${this.urlBase}/Event/${eventId}/assign-supervisor`,
      { supervisorUserIds },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Asignar un supervisor individual
  assignSupervisorIndividual(eventId: number, userId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.urlBase}/Event/${eventId}/supervisors/${userId}`,
      {}
    );
  }

  // Eliminar un supervisor
  removeSupervisor(eventId: number, userId: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.urlBase}/Event/${eventId}/supervisors/${userId}`
    );
  }

  // Finalizar evento
  finalizeEvent(eventId: number): Observable<FinalizeEventResponse> {
    return this.http.put<FinalizeEventResponse>(
      `${this.urlBase}/Event/${eventId}/finalize`,
      {}
    );
  }

  // Generar QR para punto de acceso
  generateAccessPointQr(qrCodeKey: string): Observable<Blob> {
    const headers = { 'Accept': 'image/png' };
    return this.wrapper.handleRequest(
      this.http.get(`${this.urlBase}/AccessPoint/generate/${qrCodeKey}`, {
        headers,
        responseType: 'blob'
      })
    );
  }

}
