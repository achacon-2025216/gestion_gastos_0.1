import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gastos.html',
  styleUrl: './gastos.css',
})
export class Gastos {

}