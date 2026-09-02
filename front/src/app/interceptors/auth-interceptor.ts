import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Llamamos a getToken() sin argumentos (0 argumentos) para obtener el token del localStorage
  const token = authService.getToken();

  if (token) {
    // Clonamos la petición para agregarle la cabecera de autorización con el token Bearer
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};