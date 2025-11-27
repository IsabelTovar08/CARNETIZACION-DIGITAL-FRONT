import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceWrapperService } from '../../loanding/http-service-wrapper.service';
import { ApiService } from '../api.service';
import { ApiResponse } from '../../../Models/api-response.models';
import { Observable } from 'rxjs';
import { CarnetsByUnit, CarnetsByShedule, CarnetsByDivision, CarnetsByUnitResponse } from '../../../Models/organization/cards-dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class CardsService extends ApiService<any, any> {

  constructor(http: HttpClient, wrapper: HttpServiceWrapperService) {
    super(http, wrapper);
  }

  GetTotalNumberOfIDCardConfigurationsAsync(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.urlBase}/Card/total`);
  }

  GetTotalNumberOfIDCardsAsync(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.urlBase}/IssuedCard/total`);
  }

  // Carnets por unidad organizativa
  getByUnit(): Observable<ApiResponse<CarnetsByUnitResponse>> {
    return this.http.get<ApiResponse<CarnetsByUnitResponse>>(`${this.urlBase}/IssuedCard/by-unit`);
  }

  // Carnets por jornada
  getByShedule(): Observable<ApiResponse<CarnetsByShedule[]>> {
    return this.http.get<ApiResponse<CarnetsByShedule[]>>(`${this.urlBase}/IssuedCard/by-shedule`);
  }

  // Carnets por división interna
  getInternalDivisionByUnit(unitId: number): Observable<ApiResponse<CarnetsByDivision[]>> {
    return this.http.get<ApiResponse<CarnetsByDivision[]>>(`${this.urlBase}/IssuedCard/by-unit/${unitId}/divisions`);
  }

  CrearWithImage(endpoint: string, data: FormData) {
    return this.wrapper.handleRequest(this.http.post(`${this.urlBase}/${endpoint}`, data));
  }

  ActualizarWithImage(endpoint: string, data: FormData) {
    return this.wrapper.handleRequest(this.http.put(`${this.urlBase}/${endpoint}`, data));
  }


}
