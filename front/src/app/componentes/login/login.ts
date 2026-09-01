import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements AfterViewInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  logoSrc: string = 'assets/logo.png'; 
  sessionExpired: boolean = false;
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  @ViewChild('googleBtn', { static: false }) googleBtn!: ElementRef;

  ngAfterViewInit(): void {
    this.initGoogleSignIn();
  }

  initGoogleSignIn(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '463867676917-g8hga9ugqt9um24hpkoakrhlrt7jjhbs.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleCredentialResponse(response)
      });

      if (this.googleBtn && this.googleBtn.nativeElement) {
        google.accounts.id.renderButton(
          this.googleBtn.nativeElement,
          { 
            theme: 'outline', 
            size: 'large', 
            shape: 'pill', 
            width: '100%'  
          }
        );
      }
    }
  }

  handleGoogleCredentialResponse(response: any): void {
    try {
      const token = response.credential;
      console.log('Token JWT de Google obtenido con éxito:', token);

      // 1. Guardamos el token en el almacenamiento local para que la app sepa que estás logueado
      localStorage.setItem('token', token);

      // 2. Redirigimos a la vista principal de gastos
      this.router.navigate(['/gastos']);
    } catch (error: any) {
      console.error('Error en el inicio de sesión con Google:', error);
      this.errorMessage = 'No se pudo completar el acceso con Google.';
    }
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.errorMessage = '';
    console.log('Iniciando sesión con:', this.username, this.password);
  }
}