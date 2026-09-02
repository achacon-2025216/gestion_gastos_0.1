import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario actual es administrador usando el método isAdmin() que añadimos al AuthService
  if (authService.isAdmin()) {
    return true;
  }

  // Si no es admin, lo redirige al inicio de gastos o login
  router.navigate(['/inicio-gastos']);
  return false;
};