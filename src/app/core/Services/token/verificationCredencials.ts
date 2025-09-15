import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../Models/api-response.models';
import { UserMeDto } from '../../Models/security/user-me.models';
import { PersonCreate } from '../../Models/security/person.models';

@Injectable({
  providedIn: 'root'
})
export class VerificationCredencials {
  private http = inject(HttpClient);


  urlBase = environment.URL + '/api/User';

  // Método para verificar contraseña
  public verifyPassword(Password: string): Observable<any> {
    return this.http.post(`${this.urlBase}/verify-password`, { Password }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

   // Obtener usuario básico (UserMeDto → para topbar o info mínima)
  // public getMe(): Observable<ApiResponse<UserMeDto>> {
  //   return this.http.get<any>(`${this.urlBase}/me`).pipe(
  //     map(res => ({
  //       success: res.status,
  //       message: res.message,
  //       data: res.data
  //     }))
  //   );
  // }

  // Obtener perfil completo con datos de persona (UserProfileDto)
  public getProfile(): Observable<ApiResponse<UserMeDto>> {
  return this.http.get<ApiResponse<UserMeDto>>(`${this.urlBase}/profile`);
}

  // ✅ Actualizar datos del perfil (Persona asociada al User)
  public updateProfile(person: PersonCreate): Observable<ApiResponse<any>> {
    return this.http.put<any>(`${this.urlBase}/profile`, person).pipe(
      map(res => ({
        success: res.status,
        message: res.message,
        data: res.data
      }))
    );
  }

}
