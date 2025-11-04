import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { environment } from '../../../../environments/environment';
import { Observable, switchMap, tap } from 'rxjs';
import { TokenService } from '../token/token.service';
import { RefreshRequest, RequestCode, RequestLogin, ResponseLogin, ResponseToken } from '../../Models/auth.models';
import { HttpServiceWrapperService } from '../loanding/http-service-wrapper.service';
import { UserMe } from '../../Models/security/user.models';
import { UserStoreService } from './user-store.service';
import { ApiResponse } from '../../Models/api-response.models';
import { CHECK_AUTH } from '../../auth/auth-context';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    protected wrapper: HttpServiceWrapperService,
    private userStore: UserStoreService,
  ) { }


  urlBase = environment.API_BASE_URL + '/api';

  // Auth
  public login(credentials: RequestLogin) {

    return this.wrapper.handleRequest(this.http.post<any>(`${this.urlBase}/Auth/login`, credentials, {
      context: new HttpContext().set(CHECK_AUTH, false)
    }))
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
    return this.wrapper.handleRequest(this.http.post<any>(`${this.urlBase}/Auth/verify-code`, credentials, {
      context: new HttpContext().set(CHECK_AUTH, false)
    }))
      .pipe(
        tap(res => this.tokenService.setTokens(res.accessToken, res.refreshToken)),
        switchMap(() => this.getMe()),
        tap(user => this.userStore.setUser(user.data)),
      );
  }

  public refresh(refreshToken: RefreshRequest) {
    return this.http.post<ResponseToken>(`${this.urlBase}/Auth/refresh`, refreshToken, {
      context: new HttpContext().set(CHECK_AUTH, false)
    })
      .pipe(
        tap(pair => {
          console.log('[REFRESH RESPONSE]', pair);
          this.tokenService.setTokens(pair.accessToken, pair.refreshToken);
        })
      );
  }


  public getMe() {
    return this.http.get<ApiResponse<UserMe>>(`${this.urlBase}/user/me`)
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
