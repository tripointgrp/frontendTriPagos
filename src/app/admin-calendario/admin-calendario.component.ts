import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

type Color = 'green' | 'yellow' | 'red';
type Evento = {
  date: string;     // ISO: '2025-03-13'
  time: string;     // '15:00'
  title: string;    // 'Salón de eventos'
  color: Color;     // 'green' | 'yellow' | 'red'
};

type DayCell = {
  date: Date | null;  // null = día vacío (relleno)
  inMonth: boolean;
  events: Evento[];
};

@Component({
  selector: 'admin-calendario',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-calendario.component.html',
  styleUrls: ['./admin-calendario.component.scss']
})
export class AdminCalendarioComponent {
  usuario = 'Carlos';

  // Mes mostrado
  current = new Date(); // hoy
  viewYear  = this.current.getFullYear();
  viewMonth = this.current.getMonth(); // 0-11

  // Eventos de ejemplo (con colores como el mockup)
  eventos: Evento[] = [
    { date: '2025-03-10', time: '19:00', title: 'Terraza',         color: 'yellow' },
    { date: '2025-03-13', time: '15:00', title: 'Salón de eventos',color: 'green'  },
    { date: '2025-03-13', time: '17:00', title: 'Salón de eventos',color: 'yellow' },
    { date: '2025-03-13', time: '19:00', title: 'Cancha',          color: 'green'  },
    { date: '2025-03-16', time: '14:00', title: 'Cancha',          color: 'yellow' },
    { date: '2025-03-19', time: '13:00', title: 'Churrasquera',    color: 'green'  },
    { date: '2025-03-19', time: '19:00', title: 'Salón de eventos',color: 'red'    },
    { date: '2025-04-19', time: '19:00', title: 'Salón de eventos',color: 'green'    },
  ];

  weeks: DayCell[][] = [];

  acciones = [
    { label: 'Reservaciones',   action: 'reservaciones' },
    { label: 'Calendario',      action: 'calendario' },
    { label: 'Áreas Comunales', action: 'areas' },
  ];

  constructor() {
    // fija la vista a marzo 2025 para que calce con el mockup
    this.viewYear = 2025;
    this.viewMonth = 2; // marzo
    this.buildCalendar();
  }

  private buildCalendar() {
    const first = new Date(this.viewYear, this.viewMonth, 1);
    const last  = new Date(this.viewYear, this.viewMonth + 1, 0);
    const firstWeekday = (first.getDay() + 6) % 7; // Lunes=0 ... Domingo=6
    const daysInMonth = last.getDate();

    const cells: DayCell[] = [];

    // Relleno previo
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ date: null, inMonth: false, events: [] });
    }

    // Días del mes
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(this.viewYear, this.viewMonth, d);
      const iso = date.toISOString().substring(0, 10);
      const dayEvents = this.eventos.filter(e => e.date === iso);
      cells.push({ date, inMonth: true, events: dayEvents });
    }

    // Relleno posterior hasta completar 6 filas * 7 cols = 42 celdas
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, inMonth: false, events: [] });
    }
    while (cells.length < 42) {
      cells.push({ date: null, inMonth: false, events: [] });
    }

    // Partir en semanas
    this.weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      this.weeks.push(cells.slice(i, i + 7));
    }
  }

  monthLabel(): string {
    return new Date(this.viewYear, this.viewMonth, 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  }

  nav(delta: number) {
    const d = new Date(this.viewYear, this.viewMonth + delta, 1);
    this.viewYear = d.getFullYear();
    this.viewMonth = d.getMonth();
    this.buildCalendar();
  }

  onAccion(a: string) {
    console.log('click:', a);
  }
}
