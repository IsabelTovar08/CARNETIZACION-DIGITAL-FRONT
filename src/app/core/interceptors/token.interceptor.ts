import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../Services/token/token.service';
import { AuthService } from '../Services/auth/auth-service.service';
import { CHECK_AUTH } from '../auth/auth-context';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  if (!req.context.get(CHECK_AUTH)) {
    return next(req);
  }

  const accessToken = tokenService.getAccessToken();
  const refreshToken = tokenService.getRefreshToken();

  // Si no hay tokens → seguir sin auth
  if (!accessToken && !refreshToken) {
    return next(req);
  }

  // Si hay access válido → añadir header
  if (accessToken && !tokenService.isAccessExpired()) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
    return next(cloned).pipe(
      catchError(err => {
        // 👇 Capturamos un 401 inesperado aquí
        if (err.status === 401 && refreshToken) {
          return authService.refresh({ refreshToken }).pipe(
            switchMap(() => {
              const newAccess = tokenService.getAccessToken();
              const retry = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccess}` }
              });
              return next(retry);
            }),
            catchError(refreshErr => {
              tokenService.logoutWithAlert();
              return throwError(() => refreshErr);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }

  // Si access expiró pero hay refresh → intentar directo
  if (refreshToken) {
    return authService.refresh({ refreshToken }).pipe(
      switchMap(() => {
        const newAccess = tokenService.getAccessToken();
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${newAccess}` }
        });
        return next(cloned);
      }),
      catchError(err => {
        tokenService.logoutWithAlert();
        return throwError(() => err);
      })
    );
  }

  // Nada válido → cerrar sesión
  tokenService.logoutWithAlert();
  return throwError(() => new Error('No valid tokens'));
};
