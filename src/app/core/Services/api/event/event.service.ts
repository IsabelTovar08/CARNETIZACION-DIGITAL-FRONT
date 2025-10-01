import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../../../Models/api-response.models';
import { CreateEventRequest, SelectOption } from '../../../Models/operational/event.model';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private urlBase = environment.URL + '/api';

  // Crear evento con accesos y audiencias
  public createEvent(dto: CreateEventRequest): Observable<ApiResponse<{id: number}>> {
    return this.http.post<ApiResponse<{id: number}>>(
      `${this.urlBase}/Event/create-with-access-points`,
      dto,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Obtener puntos de acceso por sucursal (Branch)
  public getAccessPointsByBranch(branchId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${environment.URL}/api/AccessPoint/by-branch/${branchId}`
    );
  }

  getAccessPointTypes() {
  return this.http.get<ApiResponse<SelectOption[]>>(
    `${environment.URL}/api/AccessPoint`
  );
}

  // Obtener detalles completos de un evento
  public getEventDetails(eventId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.urlBase}/details/${eventId}`
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

}