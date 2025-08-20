import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosRegistroComponent } from './ingresos-registro.component';

describe('IngresosRegistroComponent', () => {
  let component: IngresosRegistroComponent;
  let fixture: ComponentFixture<IngresosRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresosRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
