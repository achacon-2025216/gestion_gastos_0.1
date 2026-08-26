import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
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

  private hoyComoTexto(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  nuevo: { descripcion: string; monto: number | null; tipo: TipoMovimiento; categoria: CategoriaKey; fecha: string } = {
    descripcion: '',
    monto: null,
    tipo: 'egreso',
    categoria: 'canasta',
    fecha: this.hoyComoTexto(),
  };

  errores: { descripcion?: string; monto?: string; fecha?: string } = {};

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

  @ViewChild('descripcionInput') descripcionInput?: ElementRef<HTMLInputElement>;

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    setTimeout(() => this.descripcionInput?.nativeElement.focus(), 0);
  }

  // --- Menú desplegable "Menú / Este mes / Mes pasado / Este año" ---
  menuAbierto = false;
  menuSeleccionado = 'Menú';
  opcionesMenu = ['Este mes', 'Mes pasado', 'Este año'];

  // Cierra el menú si el usuario hace clic en cualquier parte fuera de él
  @HostListener('document:click', ['$event'])
  clickFuera(event: Event): void {
    if (!this.menuAbierto) return;
    if (!(event.target as HTMLElement).closest('.menu-dropdown')) {
      this.menuAbierto = false;
    }
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    if (this.mostrarFormulario) {
      this.cerrarFormulario();
    }
  }

  abrirFiltro(): void {
    // lógica de filtros pendiente
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.nuevo = { descripcion: '', monto: null, tipo: 'egreso', categoria: 'canasta', fecha: this.hoyComoTexto() };
    this.categoriaSugerida = null;
    this.errores = {};
  }

  mostrarToast = false;
  mensajeToast = '';
  private timeoutToast: any;

  private lanzarToast(mensaje: string): void {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    clearTimeout(this.timeoutToast);
    this.timeoutToast = setTimeout(() => (this.mostrarToast = false), 2500);
  }

  agregarMovimiento(): void {
    this.errores = {};

    if (!this.nuevo.descripcion.trim()) {
      this.errores.descripcion = 'Escribe una descripción para el movimiento.';
    }
    if (!this.nuevo.monto || this.nuevo.monto <= 0) {
      this.errores.monto = 'Ingresa un monto mayor a Q0.00.';
    }
    if (!this.nuevo.fecha) {
      this.errores.fecha = 'Selecciona una fecha.';
    }

    if (Object.keys(this.errores).length > 0) {
      return;
    }

    const categoriaFinal = this.nuevo.tipo === 'ingreso' ? 'ingreso' : this.nuevo.categoria;
    this.movimientos.unshift({
      id: Date.now(),
      descripcion: this.nuevo.descripcion.trim(),
      categoria: categoriaFinal,
      tipo: this.nuevo.tipo,
      monto: this.nuevo.monto!,
      fecha: new Date(this.nuevo.fecha + 'T00:00:00'),
    });
    this.cerrarFormulario();
    this.lanzarToast('Movimiento agregado correctamente.');
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