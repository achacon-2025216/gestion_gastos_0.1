import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type CategoriaKey = 'canasta' | 'servicios' | 'transporte' | 'ahorro';
type TipoMovimiento = 'ingreso' | 'egreso';

interface Movimiento {
  id: number;
  descripcion: string;
  categoria: CategoriaKey | 'ingreso';
  tipo: TipoMovimiento;
  monto: number;
  fecha: Date;
}

interface Categoria {
  key: CategoriaKey;
  nombre: string;
  icono: string;
  presupuesto: number;
}

@Component({
  selector: 'app-inicio-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-gastos.html',
  styleUrl: './inicio-gastos.css'
})
export class InicioGastos {

  constructor(private router: Router) {}

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // --- Validación de Rol ---
  esAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  // --- "Compromisos financieros" que el usuario define al inicio de mes ---
  categorias: Categoria[] = [
    { key: 'canasta', nombre: 'Canasta Básica', icono: '🛒', presupuesto: 1200 },
    { key: 'servicios', nombre: 'Servicios del Hogar', icono: '💡', presupuesto: 450 },
    { key: 'transporte', nombre: 'Transporte', icono: '🚌', presupuesto: 300 },
    { key: 'ahorro', nombre: 'Ahorro', icono: '🏦', presupuesto: 500 },
  ];

  // --- Datos de ejemplo ---
  movimientos: Movimiento[] = [
    { id: 1, descripcion: 'Sueldo quincena', categoria: 'ingreso', tipo: 'ingreso', monto: 2500, fecha: new Date(2026, 7, 1) },
    { id: 2, descripcion: 'Supermercado La Torre', categoria: 'canasta', tipo: 'egreso', monto: 380, fecha: new Date(2026, 7, 3) },
    { id: 3, descripcion: 'Recibo de luz', categoria: 'servicios', tipo: 'egreso', monto: 95, fecha: new Date(2026, 7, 5) },
    { id: 4, descripcion: 'Gasolina', categoria: 'transporte', tipo: 'egreso', monto: 60, fecha: new Date(2026, 7, 7) },
    { id: 5, descripcion: 'Depósito ahorro', categoria: 'ahorro', tipo: 'egreso', monto: 200, fecha: new Date(2026, 7, 8) },
  ];

  mostrarFormulario = false;
  categoriaSugerida: CategoriaKey | null = null;

  nuevo: { descripcion: string; monto: number | null; tipo: TipoMovimiento; categoria: CategoriaKey } = {
    descripcion: '',
    monto: null,
    tipo: 'egreso',
    categoria: 'canasta',
  };

  // Palabras clave para categorizar automáticamente los egresos
  private palabrasClave: Record<string, CategoriaKey> = {
    luz: 'servicios', agua: 'servicios', internet: 'servicios', cable: 'servicios',
    super: 'canasta', mercado: 'canasta', supermercado: 'canasta', comida: 'canasta',
    bus: 'transporte', gasolina: 'transporte', uber: 'transporte', taxi: 'transporte', pasaje: 'transporte',
    ahorro: 'ahorro', deposito: 'ahorro', 'depósito': 'ahorro',
  };

  sugerirCategoria(): void {
    const texto = this.nuevo.descripcion.toLowerCase();
    const encontrada = Object.keys(this.palabrasClave).find(p => texto.includes(p));
    this.categoriaSugerida = encontrada ? this.palabrasClave[encontrada] : null;
    if (this.categoriaSugerida) {
      this.nuevo.categoria = this.categoriaSugerida;
    }
  }

  get totalIngresos(): number {
    return this.movimientos.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0);
  }

  get totalEgresos(): number {
    return this.movimientos.filter(m => m.tipo === 'egreso').reduce((s, m) => s + m.monto, 0);
  }

  get saldoRestante(): number {
    return this.totalIngresos - this.totalEgresos;
  }

  gastoPorCategoria(cat: CategoriaKey): number {
    return this.movimientos
      .filter(m => m.categoria === cat && m.tipo === 'egreso')
      .reduce((s, m) => s + m.monto, 0);
  }

  porcentaje(cat: Categoria): number {
    if (!cat.presupuesto) return 0;
    return Math.min(100, Math.round((this.gastoPorCategoria(cat.key) / cat.presupuesto) * 100));
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevo = { descripcion: '', monto: null, tipo: 'egreso', categoria: 'canasta' };
    this.categoriaSugerida = null;
  }

  agregarMovimiento(): void {
    if (!this.nuevo.descripcion.trim() || !this.nuevo.monto || this.nuevo.monto <= 0) {
      return;
    }
    const categoriaFinal = this.nuevo.tipo === 'ingreso' ? 'ingreso' : this.nuevo.categoria;
    this.movimientos.unshift({
      id: Date.now(),
      descripcion: this.nuevo.descripcion.trim(),
      categoria: categoriaFinal,
      tipo: this.nuevo.tipo,
      monto: this.nuevo.monto,
      fecha: new Date(),
    });
    this.cerrarFormulario();
  }

  // Alias requerido por el botón Guardar del HTML
  guardarMovimiento(): void {
    this.agregarMovimiento();
  }

  eliminarMovimiento(id: number): void {
    this.movimientos = this.movimientos.filter(m => m.id !== id);
  }

  nombreCategoria(key: string): string {
    if (key === 'ingreso') return 'Ingreso';
    return this.categorias.find(c => c.key === key)?.nombre ?? key;
  }
}