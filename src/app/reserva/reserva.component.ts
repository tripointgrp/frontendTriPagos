import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PhoneAppBarComponent } from '../components/phone-app-bar/phone-app-bar.component';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PhoneAppBarComponent,
    NgbDatepickerModule
  ],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.scss'
})
export class ReservaComponent {
  activeTab: 'reservar' | 'misReservas' = 'reservar';

  amenidades = ['Gimnasio', 'Piscina', 'Salón de eventos'];
  amenidadSeleccionada = '';
  fechaSeleccionada: NgbDateStruct | null = null;
  horaEntrada = '';
  horaSalida = '';

  reservas: { amenidad: string; fecha: string; entrada: string; salida: string }[] = [];

  fechasOcupadas: NgbDateStruct[] = [
    { year: 2025, month: 7, day: 20 },
    { year: 2025, month: 7, day: 25 },
    { year: 2025, month: 7, day: 28 },
  ];

  horariosReservados: Record<string, string[]> = {
    '2025-07-20': ['10:00', '14:00'],
    '2025-07-25': ['08:00', '09:30', '15:00']
  };

  horasDisponibles = [
    '08:00', '08:30',
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00'
  ];

  get horasOcupadas(): string[] {
    if (!this.fechaSeleccionada) return [];

    const key = `${this.fechaSeleccionada.year}-${this.fechaSeleccionada.month
      .toString().padStart(2, '0')}-${this.fechaSeleccionada.day
      .toString().padStart(2, '0')}`;

    return this.horariosReservados[key] || [];
  }

  esFechaOcupada = (date: NgbDateStruct): boolean => {
    return this.fechasOcupadas.some(
      (d) => d.year === date.year && d.month === date.month && d.day === date.day
    );
  };

  reservarAmenidad() {
    if (!this.amenidadSeleccionada || !this.fechaSeleccionada || !this.horaEntrada || !this.horaSalida) {
      alert('Completa todos los campos antes de reservar.');
      return;
    }

    if (this.horaEntrada >= this.horaSalida) {
      alert('La hora de entrada debe ser menor que la de salida.');
      return;
    }

    const fechaKey = `${this.fechaSeleccionada.year}-${this.fechaSeleccionada.month
      .toString().padStart(2, '0')}-${this.fechaSeleccionada.day
      .toString().padStart(2, '0')}`;

    // Validar que ninguna de las horas esté ocupada
    const horasEnRango = this.horasDisponibles.filter(
      h => h >= this.horaEntrada && h < this.horaSalida
    );

    const ocupadas = horasEnRango.filter(h => this.horasOcupadas.includes(h));
    if (ocupadas.length > 0) {
      alert(`Las siguientes horas están ocupadas: ${ocupadas.join(', ')}`);
      return;
    }

    const fechaString = `${this.fechaSeleccionada.day
      .toString().padStart(2, '0')}/${this.fechaSeleccionada.month
      .toString().padStart(2, '0')}/${this.fechaSeleccionada.year}`;

    this.reservas.push({
      amenidad: this.amenidadSeleccionada,
      fecha: fechaString,
      entrada: this.horaEntrada,
      salida: this.horaSalida,
    });

    // Ocupar horas en el rango
    if (!this.horariosReservados[fechaKey]) {
      this.horariosReservados[fechaKey] = [];
    }
    this.horariosReservados[fechaKey].push(...horasEnRango);

    alert('Reserva realizada exitosamente ✅');

    // Resetear
    this.amenidadSeleccionada = '';
    this.fechaSeleccionada = null;
    this.horaEntrada = '';
    this.horaSalida = '';
    this.activeTab = 'misReservas';
  }
}
