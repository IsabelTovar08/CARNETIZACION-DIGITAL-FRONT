import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { ApiResponse } from "../../../Models/api-response.models";
import { Organization, OrganizationUpdate } from "../../../Models/organization/organization.models";

@Injectable({
  providedIn: 'root'
})
export class OrganizationalService {
    private http = inject(HttpClient);
  private urlBase = environment.API_BASE_URL + '/api';

  // Obtener la organización del usuario actual
  public getMyOrganization(): Observable<ApiResponse<Organization>> {
    return this.http.get<ApiResponse<Organization>>(
      `${this.urlBase}/Organization/me/organization`,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Actualizar la organización del usuario actual
  public updateMyOrganization(data: OrganizationUpdate): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.urlBase}/Organization/my-organization`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

}

