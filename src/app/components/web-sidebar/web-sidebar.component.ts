import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'web-sidebar',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink, RouterLinkActive],
  templateUrl: './web-sidebar.component.html',
  styleUrls: ['./web-sidebar.component.scss'],
})
export class WebSidebarComponent {
  @Output() toggle = new EventEmitter<void>();
  appName = 'TriPagos';
  items = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin-dashboard' },
    // { label: 'Condominios', icon: 'apartment', route: '/condominios' },
    // { label: 'Residentes', icon: 'people', route: '/residentes' },
    // { label: 'Pagos', icon: 'receipt_long', route: '/pagos' },
    // { label: 'Reportes', icon: 'bar_chart', route: '/reportes' },
    // { label: 'Reservaciones', icon: 'event', route: '/reservaciones' },
    { label: 'Usuarios', icon: 'people', route: '/usuarios' },
    { label: 'Roles', icon: 'security', route: '/roles' },
    { label: 'Unidades', icon: 'home_work', route: '/unidades' },
    { label: 'Residencias', icon: 'location_city', route: '/residencias' },
    { label: 'Amenidades', icon: 'local_offer', route: '/amenidades' },
    { label: 'Configuración', icon: 'settings', route: '/configuracion' },
    { label: 'Cerrar Sesión', icon: 'logout', route: '/login' },
  ];

  constructor(private auth: AuthService) {}

  clearLocalhost(): void {
    localStorage.clear();
  }

  onNavClick(route: string): void {
    if (route === '/login') {
      this.auth.setRole(null);

      // location.href = route;
    }
  }
}
