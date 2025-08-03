import { Injectable } from '@angular/core';
import { setCookie, getCookie, removeCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey: string = 'token';

  constructor() { }

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
}
