import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

type FuenteIngreso = 'Salario' | 'Freelance' | 'Otros';

interface Movimiento {
  fecha: string;
  descripcion: string;
  fuente: FuenteIngreso;
  monto: number;
}

interface Transferencia {
  nombre: string;
  fecha: string;
  monto: number;
}

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ingresos.html',
  styleUrl: './ingresos.css',
})
export class Ingresos {
  private authService = inject(AuthService);

  username = this.authService.getCurrentUser()?.username ?? 'Usuario';
  searchText = '';
  sourceFilter = '';
  showIncomeModal = false;
  showTransferModal = false;
  transferType: 'Transferencia' | 'Pago' = 'Transferencia';

  movimientos: Movimiento[] = [
    { fecha: '03/08/2026', descripcion: 'Sueldo quincena', fuente: 'Salario', monto: 3500 },
    { fecha: '09/08/2026', descripcion: 'Diseño de sitio web', fuente: 'Freelance', monto: 850 },
    { fecha: '15/08/2026', descripcion: 'Venta de artículo', fuente: 'Otros', monto: 200 },
  ];

  transferencias: Transferencia[] = [
    { nombre: 'Pago de tarjeta', fecha: '15/08/2026', monto: 200 },
  ];

  newIncome: { descripcion: string; fuente: FuenteIngreso; monto: number | null } = {
    descripcion: '', fuente: 'Salario', monto: null,
  };
  newTransfer: { nombre: string; monto: number | null; nota: string } = {
    nombre: '', monto: null, nota: '',
  };

  get totalIngreso(): number {
    return this.movimientos.reduce((total, movimiento) => total + movimiento.monto, 0);
  }

  get saldoPorPagar(): number {
    return this.transferencias.reduce((total, transferencia) => total + transferencia.monto, 0);
  }

  get categorias(): Array<{ nombre: FuenteIngreso; porcentaje: number; color: string }> {
    const total = this.totalIngreso;
    const fuentes: FuenteIngreso[] = ['Salario', 'Freelance', 'Otros'];
    const colores: Record<FuenteIngreso, string> = {
      Salario: '#1f9d66', Freelance: '#2a6f8f', Otros: '#f2b84b',
    };

    return fuentes.map(nombre => {
      const monto = this.movimientos
        .filter(movimiento => movimiento.fuente === nombre)
        .reduce((subtotal, movimiento) => subtotal + movimiento.monto, 0);
      return { nombre, porcentaje: total ? Math.round((monto / total) * 100) : 0, color: colores[nombre] };
    });
  }

  filteredMovimientos(): Movimiento[] {
    const termino = this.searchText.trim().toLowerCase();
    return this.movimientos.filter(movimiento =>
      (!termino || movimiento.descripcion.toLowerCase().includes(termino)) &&
      (!this.sourceFilter || movimiento.fuente === this.sourceFilter)
    );
  }

  tagClass(fuente: FuenteIngreso): string {
    return `tag-${fuente.toLowerCase()}`;
  }

  openIncomeModal(): void {
    this.showIncomeModal = true;
  }

  closeIncomeModal(): void {
    this.showIncomeModal = false;
    this.newIncome = { descripcion: '', fuente: 'Salario', monto: null };
  }

  submitIncome(): void {
    const monto = this.newIncome.monto;
    if (!this.newIncome.descripcion.trim() || !monto || monto <= 0) return;

    this.movimientos.unshift({
      fecha: new Date().toLocaleDateString('es-GT'),
      descripcion: this.newIncome.descripcion.trim(),
      fuente: this.newIncome.fuente,
      monto,
    });
    this.closeIncomeModal();
  }

  eliminarMovimiento(movimiento: Movimiento): void {
    this.movimientos = this.movimientos.filter(item => item !== movimiento);
  }

  openTransferModal(): void {
    this.showTransferModal = true;
  }

  closeTransferModal(): void {
    this.showTransferModal = false;
    this.newTransfer = { nombre: '', monto: null, nota: '' };
  }

  setTransferType(tipo: 'Transferencia' | 'Pago'): void {
    this.transferType = tipo;
  }

  submitTransfer(): void {
    const monto = this.newTransfer.monto;
    if (!this.newTransfer.nombre.trim() || !monto || monto <= 0) return;

    this.transferencias.unshift({
      nombre: this.newTransfer.nombre.trim(),
      fecha: new Date().toLocaleDateString('es-GT'),
      monto,
    });
    this.closeTransferModal();
  }
}
