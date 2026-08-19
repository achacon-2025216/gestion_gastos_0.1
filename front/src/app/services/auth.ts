import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: { id: number; username: string; role: string };
}

interface JwtPayload {
  exp: number; // segundos desde epoch, viene del backend
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Si el usuario recarga la página y ya tenía token, reprograma el auto-logout
    if (this.isLoggedIn()) {
      this.scheduleAutoLogout();
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('username', res.user.username);
        this.scheduleAutoLogout();
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  // expired = true cuando el logout ocurre automáticamente por expiración del token
  logout(expired: boolean = false): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    this.router.navigate(['/login'], {
      queryParams: expired ? { expired: '1' } : {},
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload) return false;

    // Si ya expiró, lo tratamos como no logueado
    return payload.exp * 1000 > Date.now();
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }

  // Programa el logout automático justo en el momento en que expira el token
  private scheduleAutoLogout(): void {
    const token = this.getToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload) return;

    const msUntilExpiry = payload.exp * 1000 - Date.now();

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    if (msUntilExpiry <= 0) {
      this.logout(true);
      return;
    }

    this.logoutTimer = setTimeout(() => {
      this.logout(true);
    }, msUntilExpiry);
  }
}