import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  urlBase = environment.URL + '/api';

  public ObtenerTodo(entidad: string) {
    return this.http.get<any>(`${this.urlBase}/${entidad}`);
  }
  public ObtenerActivos(entidad: string) {
    return this.http.get<any>(`${this.urlBase}/${entidad}/active`);
  }
  public Crear(entidad: string, objeto: any) {
    return this.http.post<any>(`${this.urlBase}/${entidad}`, objeto);
  }
  public update(entidad: string, data: any) {
    return this.http.put(`${this.urlBase}/${entidad}/update/`, data);
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
