import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

interface Movimiento {
  id: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
}

@Component({
  selector: 'app-inicio-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './inicio-gastos.html',
  styleUrls: ['./inicio-gastos.css']
})
export class InicioGastos {
  private authService = inject(AuthService);

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  menuAbierto = false;
  menuSeleccionado = 'Mis gastos';
  opcionesMenu = ['Mis gastos', 'Historial', 'Configuración'];

  mostrarFormulario = false;
  mostrarToast = false;
  mensajeToast = '';

  // Orden: 0: Canasta, 1: Servicios, 2: Transporte, 3: Ahorro
  categorias = [
    { key: 'canasta', nombre: 'Canasta Básica' },
    { key: 'servicios', nombre: 'Servicios del Hogar' },
    { key: 'transporte', nombre: 'Transporte' },
    { key: 'ahorro', nombre: 'Ahorro' }
  ];

  nuevo: {
    descripcion: string;
    fecha: string;
    tipo: 'ingreso' | 'egreso';
    categoria: string;
    monto: number | null;
  } = {
    descripcion: '',
    fecha: '2026-08-08',
    tipo: 'egreso',
    categoria: 'canasta',
    monto: null
  };

  errores: { [key: string]: string } = {};
  categoriaSugerida: string | null = null;

  movimientos: Movimiento[] = [
    { id: 1, fecha: '2026-08-01', descripcion: 'Sueldo quincena', categoria: 'ingreso', tipo: 'ingreso', monto: 2500.00 },
    { id: 2, fecha: '2026-08-03', descripcion: 'Supermercado La Torre', categoria: 'canasta', tipo: 'egreso', monto: 380.00 },
    { id: 3, fecha: '2026-08-05', descripcion: 'Recibo de luz', categoria: 'servicios', tipo: 'egreso', monto: 95.00 },
    { id: 4, fecha: '2026-08-07', descripcion: 'Gasolina', categoria: 'transporte', tipo: 'egreso', monto: 60.00 },
    { id: 5, fecha: '2026-08-08', descripcion: 'Depósito ahorro', categoria: 'ahorro', tipo: 'egreso', monto: 200.00 }
  ];

  esAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get totalIngresos(): number {
    return this.movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((acc, m) => acc + m.monto, 0);
  }

  get totalEgresos(): number {
    return this.movimientos
      .filter(m => m.tipo === 'egreso')
      .reduce((acc, m) => acc + m.monto, 0);
  }

  get saldoRestante(): number {
    return this.totalIngresos - this.totalEgresos;
  }

  gastoPorCategoria(key: string): number {
    return this.movimientos
      .filter(m => m.tipo === 'egreso' && m.categoria === key)
      .reduce((acc, m) => acc + m.monto, 0);
  }

  porcentajeCategoria(key: string): number {
    if (this.totalEgresos === 0) return 0;
    return (this.gastoPorCategoria(key) / this.totalEgresos) * 100;
  }

  get conicGradientStyle(): string {
    const total = this.totalEgresos;
    if (total === 0) return 'conic-gradient(#e5e7eb 0% 100%)';

    let acumulado = 0;
    const colores = ['#86efac', '#a7f3d0', '#94a3b8', '#0f4c42'];
    
    const categoriasOrdenadas = [
      this.categorias[0], // Canasta Básica
      this.categorias[1], // Servicios del Hogar
      this.categorias[2], // Transporte
      this.categorias[3]  // Ahorro
    ];

    const tramos = categoriasOrdenadas.map((cat, index) => {
      const porc = this.porcentajeCategoria(cat.key);
      if (porc === 0) return null;
      const inicio = acumulado;
      acumulado += porc;
      return `${colores[index]} ${inicio}% ${acumulado}%`;
    }).filter(t => t !== null);

    return `conic-gradient(${tramos.join(', ')})`;
  }

  nombreCategoria(key: string): string {
    if (key === 'ingreso') return 'Ingreso';
    const encontrada = this.categorias.find(c => c.key === key);
    return encontrada ? encontrada.nombre : key;
  }

  abrirFormulario() {
    this.nuevo = {
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'egreso',
      categoria: 'canasta',
      monto: null
    };
    this.errores = {};
    this.categoriaSugerida = null;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  sugerirCategoria() {
    const desc = this.nuevo.descripcion.toLowerCase();
    if (desc.includes('luz') || desc.includes('agua') || desc.includes('internet')) {
      this.categoriaSugerida = 'servicios';
    } else if (desc.includes('super') || desc.includes('comida') || desc.includes('mercado')) {
      this.categoriaSugerida = 'canasta';
    } else if (desc.includes('gasolina') || desc.includes('uber') || desc.includes('bus')) {
      this.categoriaSugerida = 'transporte';
    } else {
      this.categoriaSugerida = null;
    }
    if (this.categoriaSugerida && this.nuevo.tipo === 'egreso') {
      this.nuevo.categoria = this.categoriaSugerida;
    }
  }

  guardarMovimiento() {
    this.errores = {};
    if (!this.nuevo.descripcion.trim()) {
      this.errores['descripcion'] = 'La descripción is obligatoria.';
    }
    if (!this.nuevo.fecha) {
      this.errores['fecha'] = 'Selecciona una fecha.';
    }
    if (this.nuevo.monto === null || this.nuevo.monto <= 0) {
      this.errores['monto'] = 'Ingresa un monto válido mayor a 0.';
    }

    if (Object.keys(this.errores).length > 0) return;

    const nuevoMovimiento: Movimiento = {
      id: Date.now(),
      fecha: this.nuevo.fecha,
      descripcion: this.nuevo.descripcion,
      categoria: this.nuevo.tipo === 'ingreso' ? 'ingreso' : this.nuevo.categoria,
      tipo: this.nuevo.tipo,
      monto: Number(this.nuevo.monto)
    };

    this.movimientos.unshift(nuevoMovimiento);
    this.cerrarFormulario();
    this.mostrarMensajeToast('Movimiento agregado exitosamente');
  }

  eliminarMovimiento(id: number) {
    this.movimientos = this.movimientos.filter(m => m.id !== id);
    this.mostrarMensajeToast('Movimiento eliminado');
  }

  mostrarMensajeToast(msg: string) {
    this.mensajeToast = msg;
    this.mostrarToast = true;
    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
  }
}
