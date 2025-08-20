import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Estado = 'Activo' | 'Inactivo';
type Residente = {
  id: string;
  unidad: string;        // ej. A143
  nombre: string;
  email: string;
  telefono: string;
  estado: Estado;
  deuda: number;         // en Q
  ultimoPago?: string;   // ISO
};

@Component({
  selector: 'admin-residentes',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './admin-residentes.component.html',
  styleUrls: ['./admin-residentes.component.scss']
})
export class AdminResidentesComponent {
  usuario = 'Carlos';

  acciones = [
    { label: 'Agregar Residente', action: 'agregar' },
    { label: 'Importar CSV',      action: 'importar' },
    { label: 'Exportar',          action: 'exportar' },
    { label: 'Historial',         action: 'historial' },
  ];

  residentes: Residente[] = [
    { id: 'r1', unidad: 'A143', nombre: 'María López', email: 'maria@example.com', telefono: '5555-1111', estado: 'Activo',   deuda: 0,    ultimoPago: '2025-03-01' },
    { id: 'r2', unidad: 'A163', nombre: 'Juan Pérez',  email: 'juan@example.com',  telefono: '5555-2222', estado: 'Activo',   deuda: 550,  ultimoPago: '2025-02-01' },
    { id: 'r3', unidad: 'A123', nombre: 'Ana García',  email: 'ana@example.com',   telefono: '5555-3333', estado: 'Inactivo', deuda: 1100, ultimoPago: '2025-01-01' },
  ];

  // ===== Modal =====
  modalOpen = false;
  mode: 'create' | 'edit' = 'create';
  saving = false;

  form: Partial<Residente> = this.emptyForm();

  private emptyForm(): Partial<Residente> {
    return {
      unidad: '',
      nombre: '',
      email: '',
      telefono: '',
      estado: 'Activo',
      deuda: 0,
      ultimoPago: ''
    };
  }

  onAccion(key: string) {
    if (key === 'agregar') this.openCreate();
  }

  openCreate() {
    this.mode = 'create';
    this.form = this.emptyForm();
    this.modalOpen = true;
  }

  openEdit(r: Residente) {
    this.mode = 'edit';
    this.form = { ...r }; // clonar
    this.modalOpen = true;
  }

  closeModal() {
    if (!this.saving) this.modalOpen = false;
  }

  save() {
    // Validaciones mínimas
    if (!this.form.unidad?.trim() || !this.form.nombre?.trim() || !this.form.email?.trim()) return;

    this.saving = true;

    if (this.mode === 'create') {
      const nuevo: Residente = {
        id: 'r-' + Math.random().toString(36).slice(2, 9),
        unidad: this.form.unidad!.trim(),
        nombre: this.form.nombre!.trim(),
        email: this.form.email!.trim(),
        telefono: (this.form.telefono || '').trim(),
        estado: (this.form.estado || 'Activo') as Estado,
        deuda: Number(this.form.deuda || 0),
        ultimoPago: this.form.ultimoPago || undefined
      };
      this.residentes = [nuevo, ...this.residentes];
    } else {
      // Editar
      this.residentes = this.residentes.map(r => {
        if (r.id !== this.form.id) return r;
        return {
          ...r,
          unidad: this.form.unidad!.trim(),
          nombre: this.form.nombre!.trim(),
          email: this.form.email!.trim(),
          telefono: (this.form.telefono || '').trim(),
          estado: (this.form.estado || 'Activo') as Estado,
          deuda: Number(this.form.deuda || 0),
          ultimoPago: this.form.ultimoPago || undefined
        };
      });
    }

    this.saving = false;
    this.modalOpen = false;
  }

  delete(r: Residente) {
    this.residentes = this.residentes.filter(x => x.id !== r.id);
  }
}
