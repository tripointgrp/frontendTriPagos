import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type EstadoNoti = 'Borrador' | 'Programada' | 'Enviada';
type EstadoReporte = 'Nuevo' | 'En proceso' | 'Resuelto';
type Prioridad = 'Baja' | 'Media' | 'Alta';

type Notificacion = {
  titulo: string;
  audiencia: 'Todos' | 'Torre A' | 'Torre B' | 'Unidad';
  unidad?: string;
  mensaje?: string;
  requiereAcuse?: boolean;
  programacion?: string; // ISO si está programada
  creadaEl: string;      // ISO
  estado: EstadoNoti;
  enviados: number;
  leidos: number;
  adjuntoNombre?: string;
};

type Reporte = {
  fecha: string;    // ISO
  unidad: string;   // A143
  residente: string;
  tipo: string;
  detalle: string;
  estado: EstadoReporte;
  prioridad: Prioridad;
};

@Component({
  selector: 'admin-notificaciones',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './admin-notificaciones.component.html',
  styleUrls: ['./admin-notificaciones.component.scss']
})
export class AdminNotificacionesComponent {
  usuario = 'Carlos';

  acciones = [
    { label: 'Crear Notificación', action: 'crear' },
    { label: 'Enviar a Todos',     action: 'todos' },
    { label: 'Importar CSV',       action: 'importar' },
    { label: 'Historial',          action: 'historial' },
  ];

  notificaciones: Notificacion[] = [
    { titulo: 'Corte de agua programado', audiencia: 'Todos', programacion: '2025-03-21T09:00', creadaEl: '2025-03-18', estado: 'Programada', enviados: 180, leidos: 92 },
    { titulo: 'Asamblea general', audiencia: 'Torre A', creadaEl: '2025-03-12', estado: 'Enviada', enviados: 96, leidos: 81 },
    { titulo: 'Recordatorio: cuota marzo', audiencia: 'Todos', creadaEl: '2025-03-01', estado: 'Enviada', enviados: 180, leidos: 150 },
    { titulo: 'Mantenimiento elevador', audiencia: 'Torre B', creadaEl: '2025-03-16', estado: 'Borrador', enviados: 0, leidos: 0 },
  ];

  reportes: Reporte[] = [
    { fecha: '2025-03-19', unidad: 'A143', residente: 'María López', tipo: 'Fuga de agua',  detalle: 'Goteo en baño principal', estado: 'En proceso', prioridad: 'Alta' },
    { fecha: '2025-03-18', unidad: 'A163', residente: 'Juan Pérez',  tipo: 'Ruido',        detalle: 'Ruidos nocturnos en piso 12', estado: 'Nuevo', prioridad: 'Media' },
    { fecha: '2025-03-15', unidad: 'A123', residente: 'Ana García',  tipo: 'Limpieza',     detalle: 'Pasillos torre B sucios', estado: 'Resuelto', prioridad: 'Baja' },
  ];

  // ===== Modal =====
  modalOpen = false;
  saving = false;

  form: {
    titulo: string;
    mensaje: string;
    audiencia: 'Todos' | 'Torre A' | 'Torre B' | 'Unidad';
    unidad?: string;
    requiereAcuse: boolean;
    programar: boolean;
    fechaHora?: string; // para <input type="datetime-local">
    adjuntoNombre?: string;
  } = this.emptyForm();

  emptyForm() {
    return {
      titulo: '',
      mensaje: '',
      audiencia: 'Todos' as const,
      unidad: '',
      requiereAcuse: false,
      programar: false,
      fechaHora: '',
      adjuntoNombre: ''
    };
  }

  openModal() {
    this.form = this.emptyForm();
    this.modalOpen = true;
  }
  closeModal() {
    if (!this.saving) this.modalOpen = false;
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    this.form.adjuntoNombre = file ? file.name : '';
  }

  saveNotification() {
    // Validaciones mínimas
    if (!this.form.titulo.trim()) return;
    if (this.form.audiencia === 'Unidad' && !this.form.unidad?.trim()) return;

    this.saving = true;

    // Determinar estado
    let estado: EstadoNoti = 'Borrador';
    let programacion: string | undefined;

    if (this.form.programar && this.form.fechaHora) {
      // Guardamos como Programada
      estado = 'Programada';
      programacion = this.form.fechaHora;
    }

    const nueva: Notificacion = {
      titulo: this.form.titulo.trim(),
      audiencia: this.form.audiencia,
      unidad: this.form.audiencia === 'Unidad' ? this.form.unidad?.trim() : undefined,
      mensaje: this.form.mensaje?.trim(),
      requiereAcuse: this.form.requiereAcuse,
      programacion,
      creadaEl: new Date().toISOString().slice(0, 10),
      estado,
      enviados: 0,
      leidos: 0,
      adjuntoNombre: this.form.adjuntoNombre
    };

    // Agregar al inicio
    this.notificaciones = [nueva, ...this.notificaciones];

    this.saving = false;
    this.modalOpen = false;
  }

  onAccion(key: string) {
    if (key === 'crear') this.openModal();
    // Otros flujos: todos, importar, historial...
  }
}
