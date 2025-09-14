import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../Services/token/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const token = inject(TokenService).getAccessToken();
  const router = inject(Router);

  if(!token){
    router.navigate(['/']);
  }

  return true;
};
