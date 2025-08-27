import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../Services/token/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(TokenService);
  const token = authService.getAccessToken();

  // if(req.context.get(CHECK_))

  if (token && authService.isAuthenticated()) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
