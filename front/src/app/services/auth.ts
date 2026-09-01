import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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

  constructor() {
    const token = this.getToken();
    if (token) {
      this.autoLogoutWithToken(token);
    }
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
          this.autoLogoutWithToken(response.token);
        }
      })
    );
  }

  register(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password }).pipe(
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
      this.autoLogoutWithToken(response.token);
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

  logout(): void {
    localStorage.removeItem('token');
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.router.navigate(['/login'], { queryParams: { expired: '1' } });
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
