import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // O la variable que uses para validar sesión

  if (token) {
    return true; // Deja pasar si hay sesión
  } else {
    router.navigate(['/login']); // Redirige al login si no está logueado
    return false;
  }
};