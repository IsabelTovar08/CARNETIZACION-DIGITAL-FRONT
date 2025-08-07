import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpServiceWrapperService } from '../loanding/http-service-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService<T, D> {

  constructor(
    protected http: HttpClient,
    protected wrapper: HttpServiceWrapperService
  ) { }
  urlBase = environment.URL + '/api';

  public ObtenerTodo(entidad: string): Observable<D[]> {
    return this.wrapper.handleRequest(this.http.get<D[]>(`${this.urlBase}/${entidad}`));
  }
  public ObtenerActivos(entidad: string): Observable<D> {
    return this.http.get<D>(`${this.urlBase}/${entidad}/active`);
  }
  public Crear(entidad: string, objeto: T) {
    return this.wrapper.handleRequest(this.http.post<D>(`${this.urlBase}/${entidad}`, objeto));
  }
  public update(entidad: string, data: T) {
    return this.http.put<D>(`${this.urlBase}/${entidad}/update/`, data);
  }
  public delete(entidad: string, id: number) {
    return this.http.delete(`${this.urlBase}/${entidad}/${id}`);
  }
  public deleteLogic(entidad: string, id: number) {
    return this.http.patch(`${this.urlBase}/${entidad}/toggleActive/${id}`, null);
  }

  loginWithGoogle(tokenId: string) {
    return this.http.post<{ token: string }>(`${this.urlBase}/Auth/google`, { tokenId });
  }
  exchangeCodeForToken(code: any): Observable<any> {
    return this.http.post(`${this.urlBase}/Auth/login-google-code`, { code });
  }

}
