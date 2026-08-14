import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioGastos } from './inicio-gastos';

describe('InicioGastos', () => {
  let component: InicioGastos;
  let fixture: ComponentFixture<InicioGastos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioGastos],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioGastos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
