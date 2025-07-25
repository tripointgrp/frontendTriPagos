import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSidebarComponent } from './web-sidebar.component';

describe('WebSidebarComponent', () => {
  let component: WebSidebarComponent;
  let fixture: ComponentFixture<WebSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
