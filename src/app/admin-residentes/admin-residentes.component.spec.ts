import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResidentesComponent } from './admin-residentes.component';

describe('AdminResidentesComponent', () => {
  let component: AdminResidentesComponent;
  let fixture: ComponentFixture<AdminResidentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResidentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminResidentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
