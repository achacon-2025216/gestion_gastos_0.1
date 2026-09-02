import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth'; // <--- Cambiado de 'Auth' a 'AuthService'

describe('AuthService', () => {
  let service: AuthService; // <--- Cambiado el tipo

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService); // <--- Inyectar AuthService
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});