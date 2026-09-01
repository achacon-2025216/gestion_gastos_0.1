import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements AfterViewInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

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
    const token = response.credential;
    console.log('Token JWT de Google obtenido en Registro:', token);
    
    this.successMessage = '¡Registro completado con éxito!';
    this.errorMessage = '';

    // Redirige a la vista principal de la app tras autenticarse con Google
    this.router.navigate(['/gastos']);
  }

  onRegister(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '¡Cuenta creada con éxito!';
    console.log('Registrando con:', this.username, this.password);
  }
}