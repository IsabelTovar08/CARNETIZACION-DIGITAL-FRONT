import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../token/token.service';
import { RefreshRequest, RequestCode, RequestLogin, ResponseLogin, ResponseToken } from '../../Models/auth.models';
import { HttpServiceWrapperService } from '../loanding/http-service-wrapper.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    protected wrapper: HttpServiceWrapperService

  ) { }

  urlBase = environment.URL + '/api';

  // Auth
  public login(credentials: RequestLogin) {
    debugger
    return this.wrapper.handleRequest(this.http.post<any>(`${this.urlBase}/Auth/login`, credentials))
      .pipe(
        tap(res => {
          // Guarda ambos tokens; refresh por defecto 7 días
          this.cachePendingEmail(credentials.email, res.data.userId)

          // this.tokenService.setTokens(res.accessToken, res.refreshToken);
        })
      );
  }

  // Auth
  public verifiCode(credentials: RequestCode) {
    return this.wrapper.handleRequest(this.http.post<any>(`${this.urlBase}/Auth/verify-code`, credentials))
      .pipe(
        tap(res => {
          // Guarda ambos tokens; refresh por defecto 7 días
          // this.cachePendingEmail(credentials.Email, res.userId)
          this.tokenService.setTokens(res.accessToken, res.refreshToken);
        })
      );
  }

  public refresh(refreshToken: RefreshRequest) {
    return this.http.post<ResponseToken>(`${this.urlBase}/refresh`, refreshToken)
      .pipe(
        tap(pair => {
          // Actualiza access token y refresh token
          this.tokenService.setTokens(pair.accessToken, pair.refreshToken);
        })
      );
  }

  logout(refreshToken: RefreshRequest): Observable<void> {
    return this.http.post<void>(`${this.urlBase}/revoke`, { refreshToken })
      .pipe(
        tap(() =>
          this.tokenService.removeAll()
        )
      );
  }


  cachePendingEmail(email: string, id: string) {
    sessionStorage.setItem('pending_login_email', email);
    sessionStorage.setItem('pending_login_id', id);

  }
  getPendingEmail(): string | null {
    return sessionStorage.getItem('pending_login_email');
  }
  getPendingUserId(): string | null {
    return sessionStorage.getItem('pending_login_id');
  }
}