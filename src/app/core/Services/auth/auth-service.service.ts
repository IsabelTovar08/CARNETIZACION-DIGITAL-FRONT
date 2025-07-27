import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import {jwtDecode} from 'jwt-decode';
// import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router:Router){}

  private tokenKey = 'jwt';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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
    localStorage.removeItem(this.tokenKey);
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


  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    const decoded: any = jwtDecode(token);

    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

    const roles = decoded[roleClaim];
    return Array.isArray(roles) ? roles : roles ? [roles] : [];
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
