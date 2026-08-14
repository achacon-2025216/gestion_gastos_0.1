import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login';
import { RegistroComponent } from './componentes/registro/registro';
import { InicioGastos } from './componentes/inicio-gastos/inicio-gastos';
import { authGuard } from './auth.guard'; // <--- Importación correcta

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio-gastos', component: InicioGastos, canActivate: [authGuard] }, // <--- Protegido
  { path: '**', redirectTo: 'login' }
];