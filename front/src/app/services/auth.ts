import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:4000/api';
  private logoutTimer: any;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private lastRefreshAt = 0;
  private refreshInProgress = false;
  private readonly refreshThrottleMs = 10_000;

  constructor() {
    this.listenForUserActivity();

    const token = this.getToken();
    if (token && !this.isPublicAuthPage()) {
      this.autoLogoutWithToken(token);
    }
  }

  private isPublicAuthPage(url: string = this.router.url): boolean {
    const path = url.split('?')[0];
    return path === '/' || path === '/login' || path === '/registro';
  }

  private listenForUserActivity(): void {
    const activityHandler = () => this.refreshSessionOnActivity();

    for (const eventName of ['mousemove', 'mousedown', 'click', 'keydown', 'touchstart']) {
      document.addEventListener(eventName, activityHandler, { passive: true });
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.isPublicAuthPage(event.urlAfterRedirects)) {
          this.stopSessionTimers();
          return;
        }

        const token = this.getToken();
        if (token) {
          this.autoLogoutWithToken(token);
          activityHandler();
        }
      }
    });
  }

  private refreshSessionOnActivity(): void {
    const token = this.getToken();
    const now = Date.now();

    if (this.isPublicAuthPage() || !token || !this.isLoggedIn() || this.refreshInProgress) return;
    if (now - this.lastRefreshAt < this.refreshThrottleMs) return;

    this.lastRefreshAt = now;
    this.refreshInProgress = true;

    this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}).subscribe({
      next: response => {
        this.refreshInProgress = false;
        this.saveSession(response);
        console.log('Sesión renovada por actividad del usuario.');
      },
      error: () => {
        this.refreshInProgress = false;
        this.logout();
      }
    });
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => this.saveSession(response))
    );
  }

  register(username: string, email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      tap(response => this.saveSession(response))
    );
  }

  loginWithGoogle(token: string) {
    return this.http.post<any>(`${this.apiUrl}/google-login`, { token }).pipe(
      tap(response => this.saveSession(response))
    );
  }

  private saveSession(response: any): void {
    if (response?.token) {
      this.setToken(response.token);
      if (!this.isPublicAuthPage()) {
        this.autoLogoutWithToken(response.token);
      }
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ADMIN' || payload.role === 'admin';
    } catch {
      return false;
    }
  }

  getCurrentUser(): { username: string; role: string } | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { username: payload.username || 'Usuario', role: payload.role || 'user' };
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.stopSessionTimers();
    this.lastRefreshAt = 0;
    this.refreshInProgress = false;
    this.router.navigate(['/login'], { queryParams: { expired: '1' } });
  }

  private stopSessionTimers(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private showRemainingTime(expirationTime: number): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    const printRemainingTime = () => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((expirationTime - Date.now()) / 1000)
      );
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      console.log(
        `Tiempo restante del token: ${minutes}:${seconds.toString().padStart(2, '0')}`
      );

      if (remainingSeconds === 0 && this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
    };

    printRemainingTime();
    this.countdownTimer = setInterval(printRemainingTime, 1000);
  }

  autoLogoutWithToken(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      const currentTime = new Date().getTime();
      const timeLeft = expirationDate.getTime() - currentTime;

      this.showRemainingTime(expirationDate.getTime());

      if (timeLeft <= 0) {
        this.logout();
      } else {
        if (this.logoutTimer) {
          clearTimeout(this.logoutTimer);
        }
        this.logoutTimer = setTimeout(() => {
          this.logout();
        }, timeLeft);
      }
    } catch (error) {
      this.logout();
    }
  }
}
