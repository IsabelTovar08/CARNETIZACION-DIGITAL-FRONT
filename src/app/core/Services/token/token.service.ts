import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { setCookie, getCookie, removeCookie } from 'typescript-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenKey: string = 'token';

  constructor(private router: Router) { }

  setToken(token: string): void {
    setCookie('token', token, { expires: 1, path: '/' });
  }

  public getToken() {
    const token = getCookie(this.tokenKey);
    return token;
  }

  removeToken() {
    removeCookie(this.tokenKey)
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    if (!token || !this.isTokenValid(token)) {
      this.logoutWithAlert();
      return false;
    }

    return true;
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['']);

  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }

  logoutWithAlert() {
    if (this.router.url === '/') {
      this.logout();
      return;
    }
    Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      this.logout();
    });
  }
}
