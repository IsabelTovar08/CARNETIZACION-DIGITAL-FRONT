import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

export interface PersonSearchFilters {
  search?: string;
  internalDivisionId?: number;
  organizationalUnitId?: number;
  profileId?: number;
  page?: number;
  pageSize?: number;
}

export interface PersonSearchResponse {
  success: boolean;
  message: string;
  data: any[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ManagentPersonService {

  private apiUrl = `${environment.API_BASE_URL}/api/Person`;

  constructor(private http: HttpClient) { }

  /**
   * Busca personas con filtros y paginación
   */
  search(filters: PersonSearchFilters): Observable<PersonSearchResponse> {
    let params = new HttpParams();

    if (filters.search !== undefined && filters.search !== null && filters.search.trim() !== '') {
      params = params.set('search', filters.search.trim());
    }

    if (filters.internalDivisionId !== undefined && filters.internalDivisionId !== null) {
      params = params.set('internalDivisionId', filters.internalDivisionId.toString());
    }

    if (filters.organizationalUnitId !== undefined && filters.organizationalUnitId !== null) {
      params = params.set('organizationalUnitId', filters.organizationalUnitId.toString());
    }

    if (filters.profileId !== undefined && filters.profileId !== null) {
      params = params.set('profileId', filters.profileId.toString());
    }

    if (filters.page !== undefined && filters.page !== null) {
      params = params.set('page', filters.page.toString());
    }

    if (filters.pageSize !== undefined && filters.pageSize !== null) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<PersonSearchResponse>(`${this.apiUrl}/search`, { params });
  }
}