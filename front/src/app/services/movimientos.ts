import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface MovimientoApi {
  id: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'ingreso' | 'egreso';
  monto: number | string;
}

export interface NuevoMovimiento {
  fecha?: string;
  descripcion: string;
  categoria: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:4000/api/gastos';

  private movimientosSubject =
    new BehaviorSubject<MovimientoApi[]>([]);

  movimientos$ = this.movimientosSubject.asObservable();

  /**
   * Obtiene todos los movimientos del usuario
   * desde el backend.
   */
  obtener(): Observable<MovimientoApi[]> {
    return this.http
      .get<MovimientoApi[]>(this.apiUrl)
      .pipe(
        tap(movimientos => {
          this.movimientosSubject.next(movimientos);
        })
      );
  }

  /**
   * Crea un movimiento en PostgreSQL.
   */
  crear(movimiento: NuevoMovimiento): Observable<MovimientoApi> {
    return this.http
      .post<MovimientoApi>(this.apiUrl, movimiento)
      .pipe(
        tap(nuevoMovimiento => {

          const actuales = this.movimientosSubject.value;

          this.movimientosSubject.next([
            nuevoMovimiento,
            ...actuales
          ]);
        })
      );
  }

  /**
   * Elimina un movimiento.
   */
  eliminar(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {

          const actuales = this.movimientosSubject.value;

          this.movimientosSubject.next(
            actuales.filter(
              movimiento => movimiento.id !== id
            )
          );
        })
      );
  }
}