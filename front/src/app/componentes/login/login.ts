import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
        client_id: '463867676917-g8hga9ugqt9um24hpkoakhrl7jjhbs.apps.googleusercontent.com',
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
    console.log('Token JWT de Google obtenido:', response.credential);
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