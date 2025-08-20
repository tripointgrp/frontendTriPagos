import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Reservacion = {
  area: string;        // Ej: "Cancha de fútbol"
  unidad: string;      // Ej: "A143"
  residente: string;   // Ej: "María López"
  fecha: string;       // ISO yyyy-MM-dd
  hora: string;        // Ej: "18:00 - 20:00"
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada';
};

@Component({
  selector: 'admin-reservaciones',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './admin-reservaciones.component.html',
  styleUrls: ['./admin-reservaciones.component.scss']
})
export class AdminReservacionesComponent {
  usuario = 'Carlos';

  acciones = [
    { label: 'Nueva Reservación', action: 'nueva' },
    { label: 'Confirmar',         action: 'confirmar' },
    { label: 'Cancelar',          action: 'cancelar' },
    { label: 'Historial',         action: 'historial' },
  ];

  // Amenidades (áreas) disponibles
  areas = ['Cancha de fútbol', 'Salón Social', 'Cancha de tenis', 'Piscina', 'Churrasquera'];

  // Tramos horarios comunes
  horarios = [
    '07:00 - 08:00', '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
    '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00',
    '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 20:00'
  ];

  reservaciones: Reservacion[] = [
    { area: 'Cancha de fútbol', unidad: 'A143', residente: 'María López', fecha: '2025-03-05', hora: '18:00 - 20:00', estado: 'Confirmada' },
    { area: 'Salón Social',     unidad: 'A163', residente: 'Juan Pérez',  fecha: '2025-03-06', hora: '15:00 - 17:00', estado: 'Pendiente' },
    { area: 'Cancha de tenis',  unidad: 'A123', residente: 'Ana García',  fecha: '2025-03-07', hora: '09:00 - 10:00', estado: 'Cancelada' },
  ];

  // ===== Modal Nueva Reservación =====
  modalOpen = false;
  saving = false;

  form: Partial<Reservacion> = this.emptyForm();

  // --- Estado de error por traslape ---
  overlapError: string | null = null;

  private emptyForm(): Partial<Reservacion> {
    return { area: '', unidad: '', residente: '', fecha: '', hora: '', estado: 'Pendiente' };
  }

  onAccion(key: string) {
    if (key === 'nueva') this.openModal();
    // confirmar / cancelar en lote se puede implementar después
  }

  openModal() {
    this.form = this.emptyForm();
    this.overlapError = null;
    this.modalOpen = true;
  }

  closeModal() {
    if (!this.saving) this.modalOpen = false;
  }

  /** Convierte "HH:mm - HH:mm" a minutos desde 00:00 */
  private parseHorario(h: string): { start: number; end: number } {
    const [ini, fin] = h.split('-').map(s => s.trim()); // "18:00", "20:00"
    const toMinutes = (hhmm: string) => {
      const [hh, mm] = hhmm.split(':').map(n => parseInt(n, 10));
      return hh * 60 + mm;
    };
    return { start: toMinutes(ini), end: toMinutes(fin) };
  }

  /** True si los rangos [a,b) y [c,d) se traslapan */
  private rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    return aStart < bEnd && bStart < aEnd;
  }

  /** Verifica si la nueva reservación traslapa con alguna existente (misma área y fecha, estado != Cancelada) */
  private hasOverlap(newRes: Pick<Reservacion, 'area' | 'fecha' | 'hora'>): Reservacion | null {
    const { start: ns, end: ne } = this.parseHorario(newRes.hora);
    return (
      this.reservaciones.find(r =>
        r.estado !== 'Cancelada' &&
        r.area === newRes.area &&
        r.fecha === newRes.fecha &&
        this.rangesOverlap(ns, ne, this.parseHorario(r.hora).start, this.parseHorario(r.hora).end)
      ) || null
    );
  }

  /** Recalcula el error cuando el usuario cambia área/fecha/horario */
  checkOverlapOnChange() {
    this.overlapError = null;
    if (!this.form.area || !this.form.fecha || !this.form.hora) return;
    const clash = this.hasOverlap({
      area: this.form.area!,
      fecha: this.form.fecha!,
      hora: this.form.hora!
    });
    if (clash) {
      const fechaLocal = new Date(clash.fecha).toLocaleDateString();
      this.overlapError = `El horario ${this.form.hora} choca con una reservación existente (${clash.hora}) para "${clash.area}" el ${fechaLocal}.`;
    }
  }

  saveReservation() {
    // Validaciones mínimas obligatorias
    if (!this.form.area || !this.form.fecha || !this.form.hora) return;

    // Validación de traslape (defensiva)
    const clash = this.hasOverlap({
      area: this.form.area!,
      fecha: this.form.fecha!,
      hora: this.form.hora!
    });
    if (clash) {
      const fechaLocal = new Date(clash.fecha).toLocaleDateString();
      this.overlapError = `No se puede guardar: el horario ${this.form.hora} se traslapa con ${clash.hora} en "${clash.area}" el ${fechaLocal}.`;
      return;
    }

    this.saving = true;

    const nueva: Reservacion = {
      area: this.form.area!,
      unidad: (this.form.unidad || '').trim(),       // opcional
      residente: (this.form.residente || '').trim(), // opcional
      fecha: this.form.fecha!,
      hora: this.form.hora!,
      estado: 'Pendiente'
    };

    this.reservaciones = [nueva, ...this.reservaciones];

    this.saving = false;
    this.modalOpen = false;
    this.overlapError = null; // limpiar
  }
}
