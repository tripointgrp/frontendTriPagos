import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { WebSidebarComponent } from './components/web-sidebar/web-sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgIf, WebSidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tripagos';

  // Opción A (simple): usa directamente el signal del servicio
  // isAdmin = this.auth.isAdmin;

  // Opción B (como pediste): mantener tu propio computed en el componente
  //      IMPORTANTE: lee el signal del servicio con paréntesis ()
  isAdmin = computed(() => this.auth.isAdmin());

  constructor(public auth: AuthService) {}
}
