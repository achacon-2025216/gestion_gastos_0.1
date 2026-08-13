import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login';
import { RegistroComponent } from './componentes/registro/registro';

export const routes: Routes = [
  { path: '', component: LoginComponent },           // <--- Esto hace que al abrir la app cargue el LOGIN primero
  { path: 'registro', component: RegistroComponent }, // <--- Esto carga el registro cuando haces clic
  { path: '**', redirectTo: '' }
];