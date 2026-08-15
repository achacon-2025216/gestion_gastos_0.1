import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})

export class RegistroComponent {
  username = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

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