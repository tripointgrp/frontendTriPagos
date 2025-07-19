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
  horaSeleccionada = '';

  reservas: { amenidad: string; fecha: string; hora: string }[] = [];

  // Fechas ocupadas en el calendario
  fechasOcupadas: NgbDateStruct[] = [
    { year: 2025, month: 7, day: 20 },
    { year: 2025, month: 7, day: 25 },
    { year: 2025, month: 7, day: 28 },
  ];

  // Horarios ocupados por fecha
  horariosReservados: Record<string, string[]> = {
    '2025-07-20': ['10:00', '14:00'],
    '2025-07-25': ['08:00', '09:30', '15:00']
  };

  // Horas disponibles cada 30 minutos
  horasDisponibles = [
    '08:00-09:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
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
    if (!this.amenidadSeleccionada || !this.fechaSeleccionada || !this.horaSeleccionada) {
      alert('Completa todos los campos antes de reservar.');
      return;
    }

    if (this.horasOcupadas.includes(this.horaSeleccionada)) {
      alert('La hora seleccionada ya está ocupada.');
      return;
    }

    const fechaString = `${this.fechaSeleccionada.day
      .toString().padStart(2, '0')}/${this.fechaSeleccionada.month
      .toString().padStart(2, '0')}/${this.fechaSeleccionada.year}`;

    this.reservas.push({
      amenidad: this.amenidadSeleccionada,
      fecha: fechaString,
      hora: this.horaSeleccionada,
    });

    // 👉 Ocupar la hora para esa fecha
    const fechaKey = `${this.fechaSeleccionada.year}-${this.fechaSeleccionada.month
      .toString().padStart(2, '0')}-${this.fechaSeleccionada.day
      .toString().padStart(2, '0')}`;

    if (!this.horariosReservados[fechaKey]) {
      this.horariosReservados[fechaKey] = [];
    }
    this.horariosReservados[fechaKey].push(this.horaSeleccionada);

    alert('Reserva realizada exitosamente ✅');

    // Resetear formulario
    this.amenidadSeleccionada = '';
    this.fechaSeleccionada = null;
    this.horaSeleccionada = '';
    this.activeTab = 'misReservas';
  }
}
