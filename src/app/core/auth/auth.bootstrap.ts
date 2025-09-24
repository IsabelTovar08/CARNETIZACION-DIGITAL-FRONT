import { Injectable } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../Services/auth/auth-service.service';
import { TokenService } from '../Services/token/token.service';
import { UserStoreService } from '../Services/auth/user-store.service';

@Injectable({ providedIn: 'root' })
export class AuthBootstrap {
  constructor(
    private auth: AuthService,
    private tokens: TokenService,
    private userStore: UserStoreService
  ) {}

  async init(): Promise<void> {
    // Si hay accessToken al arrancar, intenta poblar el usuario
    const token = this.tokens.getAccessToken();
    if (!token) return;

    await firstValueFrom(
      this.auth.getMe().pipe(
        catchError(() => of(null)) // si falla, no rompas el arranque
      )
    ).then(u => {
      if (u) this.userStore.setUser(u.data);
      else this.userStore.clear();
    });
  }
}
