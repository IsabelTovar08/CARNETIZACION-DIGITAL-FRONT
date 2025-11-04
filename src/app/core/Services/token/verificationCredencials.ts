import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../Models/api-response.models';
import { UserMeDto } from '../../Models/security/user-me.models';
import { PersonCreate, PersonList } from '../../Models/security/person.models';

@Injectable({
  providedIn: 'root'
})
export class VerificationCredencials {
  private http = inject(HttpClient);


  urlBase = environment.API_BASE_URL + '/api';

  // Método para verificar contraseña
  public verifyPassword(Password: string): Observable<any> {
    return this.http.post(`${this.urlBase}/User/verify-password`, { Password }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Obtener perfil completo con datos de persona (UserProfileDto)
  public getProfile(): Observable<ApiResponse<PersonList>> {
    return this.http.get<ApiResponse<PersonList>>(`${this.urlBase}/Person/me/person`);
  }

  //  Actualizar datos del perfil (Persona asociada al User)
  public updateProfile(user: PersonCreate): Observable<ApiResponse<PersonCreate>> {
    return this.http.put<ApiResponse<PersonCreate>>(`${this.urlBase}/Person/update`, user, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Cambiar contraseña
  public changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
      `${this.urlBase}/auth/change-password`,
      {
        currentPassword,
        newPassword,
        confirmNewPassword
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  /** Envía el correo de recuperación */
  public forgotPassword(email: string): Observable<ApiResponse<object>> {
    return this.http.post<ApiResponse<object>>(
      `${this.urlBase}/auth/forgot-password`,
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  /** Cambia la contraseña a una nueva */
  public resetPassword(email: string, token: string, newPassword: string): Observable<ApiResponse<object>> {
    return this.http.post<ApiResponse<object>>(
      `${this.urlBase}/auth/reset-password`,
      { email, token, newPassword },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  /** Reenvía el código de verificación */
  public resendCode(userId: number): Observable<ApiResponse<object>> {
    return this.http.post<ApiResponse<object>>(
      `${this.urlBase}/auth/resend-code`,
      { userId },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
