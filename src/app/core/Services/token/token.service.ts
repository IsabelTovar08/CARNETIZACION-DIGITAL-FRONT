import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { setCookie, getCookie, removeCookie } from 'typescript-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const ACCESS_KEY = 'token';          // Access token
const REFRESH_KEY = 'refresh_token'; // Refresh token

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private router: Router) { }

  // Guardar tokens (access 1 día, refresh 7 días por defecto)
  setTokens(access: string, refresh: string, refreshDays = 7): void {
    setCookie(ACCESS_KEY, access, { expires: 1, path: '/', sameSite: 'Strict' });
    setCookie(REFRESH_KEY, refresh, { expires: refreshDays, path: '/', sameSite: 'Strict' });
  }

  // Solo access (por si lo necesitas en otros flujos)
  setAccessToken(access: string): void {
    setCookie(ACCESS_KEY, access, { expires: 1, path: '/', sameSite: 'Strict' });
  }

  getAccessToken(): string | null {
    return getCookie(ACCESS_KEY) ?? null;
  }

  getRefreshToken(): string | null {
    return getCookie(REFRESH_KEY) ?? null;
  }

  removeAll(): void {
    removeCookie(ACCESS_KEY, { path: '/' });
    removeCookie(REFRESH_KEY, { path: '/' });
  }

  // --- Validación de access token ---

  private getAccessExp(): number | undefined {
    const token = this.getAccessToken();
    if (!token) return undefined;
    try {
      const decoded: any = jwtDecode(token);
      return typeof decoded?.exp === 'number' ? decoded.exp : undefined;
    } catch {
      return undefined;
    }
  }

  isAccessExpired(): boolean {
    const exp = this.getAccessExp();
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  }

  // ¿El access expira en <= threshold segundos?
  willAccessExpireSoon(thresholdSeconds = 30): boolean {
    const exp = this.getAccessExp();
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return (exp - now) <= thresholdSeconds;
  }

  // --- Sesión / UX ---

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token || this.isAccessExpired()) {
      this.logoutWithAlert();
      return false;
    }
    return true;
  }

  logout(): void {
    this.removeAll();
    this.router.navigate(['']);
  }

  logoutWithAlert(): void {
    if (this.router.url === '/') {
      this.logout();
      return;
    }
    Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
      confirmButtonText: 'Aceptar'
    }).then(() => this.logout());
  }


}
