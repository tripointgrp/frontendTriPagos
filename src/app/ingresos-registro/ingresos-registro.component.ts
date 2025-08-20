import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

type Ingreso = {
  unidad: string;
  rubro: string;
  emision: string;      // ISO string
  vencimiento: string;  // ISO string
};

@Component({
  selector: 'ingresos-registro',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './ingresos-registro.component.html',
  styleUrls: ['./ingresos-registro.component.scss']
})
export class IngresosRegistroComponent {
  usuario = 'Carlos';

  acciones = [
    { label: 'Registrar Cobro',        action: 'cobro' },
    { label: 'Crear Anticipo',         action: 'anticipo' },
    { label: 'Registrar Otro Ingreso', action: 'otro' },
    { label: 'Cruzar Anticipos',       action: 'cruce' },
    { label: 'Historial de Ingresos',  action: 'historial' },
  ];

  ingresos: Ingreso[] = [
    { unidad: 'Apartamento A143', rubro: 'Cuota de Mantenimiento', emision: '2025-03-01', vencimiento: '2025-03-15' },
    { unidad: 'Apartamento A163', rubro: 'Cuota de mantenimiento', emision: '2025-03-01', vencimiento: '2025-03-15' },
    { unidad: 'Apartamento A123', rubro: 'Cuota de mantenimiento', emision: '2025-03-01', vencimiento: '2025-03-15' },
  ];

  // aquí conectarás tus handlers reales
  onAccion(key: string) {
    console.log('Click acción:', key);
  }
}
