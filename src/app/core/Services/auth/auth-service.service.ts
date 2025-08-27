import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../token/token.service';
import { RefreshRequest, RequestLogin, ResponseLogin, ResponseToken } from '../../Models/auth.models';
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
    return this.wrapper.handleRequest(this.http.post<ResponseToken>(`${this.urlBase}/Auth/login`, credentials))
      .pipe(
        tap(res => {
          // Guarda ambos tokens; refresh por defecto 7 días
          this.tokenService.setTokens(res.accessToken, res.refreshToken);
        })
      );
  }

  public refresh(refreshToken: RefreshRequest){
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
}
