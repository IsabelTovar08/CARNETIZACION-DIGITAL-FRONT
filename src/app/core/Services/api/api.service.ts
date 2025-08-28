import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpServiceWrapperService } from '../loanding/http-service-wrapper.service';
import { ApiResponse } from '../../Models/api-response.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService<T, D> {

  constructor(
    protected http: HttpClient,
    protected wrapper: HttpServiceWrapperService
  ) { }
  urlBase = environment.URL + '/api';

  public ObtenerTodo(entidad: string): Observable<ApiResponse<D[]>> {
    return this.wrapper.handleRequest(this.http.get<ApiResponse<D[]>>(`${this.urlBase}/${entidad}`));
  }

  public ObtenerPorId(entidad: string, id: number): Observable<ApiResponse<D>> {
    return this.wrapper.handleRequest(this.http.get<ApiResponse<D>>(`${this.urlBase}/${entidad}/${id}`));
  }
  public ObtenerActivos(entidad: string): Observable<ApiResponse<D>> {
    return this.http.get<ApiResponse<D>>(`${this.urlBase}/${entidad}/active`);
  }
  public Crear(entidad: string, objeto: T) {
    return this.wrapper.handleRequest(this.http.post<ApiResponse<D>>(`${this.urlBase}/${entidad}`, objeto));
  }
  public update(entidad: string, data: T) : Observable<ApiResponse<D>>{
    return this.wrapper.handleRequest(this.http.put<ApiResponse<D>>(`${this.urlBase}/${entidad}/update/`, data));
  }
  public delete(entidad: string, id: number) {
    return this.wrapper.handleRequest(this.http.delete(`${this.urlBase}/${entidad}/${id}`));
  }
  public deleteLogic(entidad: string, id: number) {
    return this.wrapper.handleRequest(this.http.patch(`${this.urlBase}/${entidad}/${id}/toggle-active`, null));
  }

  loginWithGoogle(tokenId: string) {
    return this.wrapper.handleRequest(this.http.post<{ token: string }>(`${this.urlBase}/Auth/google`, { tokenId }));
  }
  exchangeCodeForToken(code: any): Observable<any> {
    return this.http.post(`${this.urlBase}/Auth/login-google-code`, { code });
  }

}
