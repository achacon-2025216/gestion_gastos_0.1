import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const credentials = { username: this.username, password: this.password };

    // Agregado '/api' a la URL
    this.http.post<any>('http://localhost:3000/api/login', credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.router.navigate(['/inicio-gastos']);
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error(err);
      }
    });
  }
}