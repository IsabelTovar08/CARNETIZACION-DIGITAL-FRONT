import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import { TokenService } from '../token/token.service';
import { RequestLogin, ResponseLogin } from '../../Models/auth.models';
import { HttpServiceWrapperService } from '../loanding/http-service-wrapper.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  updatePassword(formData: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    protected wrapper: HttpServiceWrapperService

  ) { }

  urlBase = environment.URL + '/api';

  // Auth
  public login(credentials: RequestLogin) {
    return this.wrapper.handleRequest(this.http.post<ResponseLogin>(`${this.urlBase}/Auth/login`, credentials))
      .pipe(
        tap(response => this.tokenService.setToken(response.token))
      );
  }

  // private tokenKey: string = 'token';

  // setToken(token: string): void {
  //   setCookie('token', token, {expires: 1, path: '/'});
  // }

  // getToken() {
  //   const token = getCookie(this.tokenKey);
  //   return token;
  // }

  // removeToken(){
  //   removeCookie(this.tokenKey)
  // }

  // isAuthenticated(): boolean {
  //   const token = this.getToken();

  //   if (!token || !this.isTokenValid(token)) {
  //     this.logoutWithAlert();
  //     return false;
  //   }

  //   return true;
  // }

  // logout(): void {
  //   localStorage.removeItem(this.tokenKey);
  //   this.router.navigate(['']);

  // }

  // private isTokenValid(token: string): boolean {
  //   try {
  //     const decoded: any = jwtDecode(token);
  //     const exp = decoded.exp;
  //     return Date.now() < exp * 1000;
  //   } catch {
  //     return false;
  //   }
  // }


  // getUserRoles(): string[] {
  //   const token = this.getToken();
  //   if (!token) return [];

  //   const decoded: any = jwtDecode(token);

  //   const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  //   const roles = decoded[roleClaim];
  //   return Array.isArray(roles) ? roles : roles ? [roles] : [];
  // }

  // logoutWithAlert() {
  //   if (this.router.url === '/') {
  //     this.logout();
  //     return;
  //   }
  //   Swal.fire({
  //     icon: 'warning',
  //     title: 'Sesión expirada',
  //     text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
  //     confirmButtonText: 'Aceptar'
  //   }).then(() => {
  //     this.logout();
  //   });
  // }

}
