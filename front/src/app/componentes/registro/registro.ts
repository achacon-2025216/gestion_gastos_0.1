import { Component, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

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
  private authService = inject(AuthService);
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
    this.authService.loginWithGoogle(token).subscribe({
      next: () => this.router.navigate(['/inicio-gastos']),
      error: (err) => {
        this.errorMessage = err.error?.error || 'No se pudo completar el registro con Google.';
        this.successMessage = '';
      }
    });
  }

  onRegister(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.successMessage = '¡Cuenta creada con éxito!';
        this.router.navigate(['/inicio-gastos']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'No se pudo crear la cuenta.';
        this.successMessage = '';
      }
    });
  }
}
