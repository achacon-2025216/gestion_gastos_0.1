import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true; // Deja pasar si hay sesión válida (y no expirada)
  } else {
    router.navigate(['/login'], { queryParams: { expired: '1' } });
    return false;
  }
};