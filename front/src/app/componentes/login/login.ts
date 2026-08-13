import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <--- 1. Importa RouterLink

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink], // <--- 2. Agrégalo aquí en los imports
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

}