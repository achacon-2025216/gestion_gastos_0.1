import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})

export class RegistroComponent implements AfterViewInit {
  username = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  @ViewChild('googleBtn', { static: false }) googleBtn!: ElementRef;

  constructor(private http: HttpClient, private router: Router) {}

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
    console.log('Token JWT de registro con Google obtenido:', response.credential);
    // Aquí puedes agregar la lógica para enviar el token a tu backend si lo requieres
  }

  onRegister() {
    const newUser = { username: this.username, password: this.password };

    this.http.post<any>('http://localhost:3000/api/register', newUser).subscribe({
      next: (response) => {
        this.successMessage = '¡Cuenta creada con éxito! Redirigiendo...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al registrar el usuario';
        console.error(err);
      }
    });
  }
}