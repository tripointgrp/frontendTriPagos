import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PhoneAppBarComponent } from '../components/phone-app-bar/phone-app-bar.component';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [RouterModule, CommonModule, PhoneAppBarComponent],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
})
export class PagosComponent {
  rutaActual: string = '';

  // 👉 Control de pestañas
  activeTab: 'realizados' | 'pendientes' | 'pagar' = 'realizados';
;

  // 👉 Datos simulados de pagos realizados
  pagosRealizados = [
    {
      fecha: '15 Mar, 2025',
      descripcion: 'Cuota de mantenimiento',
      numero: '23450984',
      monto: 550.0,
    },
    {
      fecha: '15 Feb, 2025',
      descripcion: 'Cuota de mantenimiento',
      numero: '23450984',
      monto: 550.0,
    },
  ];

  // 👉 Datos simulados de pagos pendientes
  pagosPendientes = [
    {
      fecha: '15 Abr, 2025',
      descripcion: 'Cuota de mantenimiento',
      monto: 550.0,
    },
  ];

  constructor(private router: Router) {}
subirPago() {
  console.log('Subir pago clicado');
  // Aquí luego puedes abrir un modal, redirigir a otra pantalla, o subir archivo
}

  ngOnInit() {
    this.rutaActual = this.router.url;
  }
}
