import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

type Pago = { fecha: string; descripcion: string; monto: number };

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  usuario = 'Carlos';

  // KPIs (ejemplo)
  deudaActual = 550;
  ultimoPagoFecha = new Date(2025, 2, 1); // 01 Mar, 2025 (mes 0-index)
  pagosAprobados = 5;

  // Tabla (mock data)
  pagosRecientes: Pago[] = [
    { fecha: '2025-03-03', descripcion: 'Cuota de mantenimiento', monto: 550 },
    { fecha: '2025-02-03', descripcion: 'Cuota de mantenimiento', monto: 550 },
    { fecha: '2025-01-03', descripcion: 'Cuota de mantenimiento', monto: 550 },
  ];
}
