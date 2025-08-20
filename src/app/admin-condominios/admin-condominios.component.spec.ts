import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCondominiosComponent } from './admin-condominios.component';

describe('AdminCondominiosComponent', () => {
  let component: AdminCondominiosComponent;
  let fixture: ComponentFixture<AdminCondominiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCondominiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCondominiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
