import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PhoneAppBarComponent } from '../components/phone-app-bar/phone-app-bar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, PhoneAppBarComponent],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
})
export class PagosComponent {
  rutaActual: string = '';

  // Control de pestañas
  activeTab: 'realizados' | 'pendientes' | 'pagar' = 'realizados';

  // Datos simulados de pagos realizados
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

  // Datos simulados de pagos pendientes
  pagosPendientes = [
    {
      fecha: '15 Abr, 2025',
      descripcion: 'Cuota de mantenimiento',
      monto: 550.0,
    },
  ];
mesesDelAnio = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

  // Formulario de pago
  mesRegistrado: string = '';
  numeroBoleta: string = '';
  fechaBoleta: string = '';
  monto: number | null = null;
  imagenAdjunta: File | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.rutaActual = this.router.url;
  }

  adjuntarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imagenAdjunta = input.files[0];
      console.log('Imagen cargada:', this.imagenAdjunta.name);
    } else {
      this.imagenAdjunta = null;
    }
  }

  subirPago() {
    if (!this.mesRegistrado || !this.fechaBoleta || !this.numeroBoleta || !this.monto) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const nuevoPago = {
      fecha: this.fechaBoleta,
      descripcion: 'Cuota de mantenimiento',
      numero: this.numeroBoleta,
      monto: this.monto,
    };

    this.pagosRealizados.unshift(nuevoPago);

    alert('✅ Pago registrado correctamente.');

    // Reset del formulario
    this.mesRegistrado = '';
    this.numeroBoleta = '';
    this.fechaBoleta = '';
    this.monto = null;
    this.imagenAdjunta = null;

    // Cambiar al tab de realizados
    this.activeTab = 'realizados';
  }
}
