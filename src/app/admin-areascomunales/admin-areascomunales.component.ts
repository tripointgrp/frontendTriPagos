import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Estado = 'Activo' | 'Inactivo';

type Area = {
  id: string;
  nombre: string;
  ubicacion?: string;
  abre?: string;   // '08:00'
  cierra?: string; // '20:00'
  requiereReserva: boolean;
  capacidad?: number;
  estado: Estado;
  edit?: boolean; // UI only
};

@Component({
  selector: 'admin-areas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-areascomunales.component.html',
  styleUrls: ['./admin-areascomunales.component.scss']
})
export class AdminAreascomunalesComponent {
  usuario = 'Carlos';

  acciones = [
    { label: 'Nueva Área', action: 'nueva' },
    { label: 'Guardar Cambios', action: 'guardar' },
    { label: 'Exportar', action: 'exportar' },
  ];

  // Mock data
  areas: Area[] = [
    { id: 'a1', nombre: 'Salón de eventos', ubicacion: 'Torre A - PB', abre: '09:00', cierra: '21:00', requiereReserva: true, capacidad: 60, estado: 'Activo' },
    { id: 'a2', nombre: 'Cancha', ubicacion: 'Patio central', abre: '06:00', cierra: '22:00', requiereReserva: false, capacidad: 10, estado: 'Activo' },
    { id: 'a3', nombre: 'Churrasquera', ubicacion: 'Azotea', abre: '10:00', cierra: '20:00', requiereReserva: true, capacidad: 20, estado: 'Inactivo' },
  ];

  onAccion(key: string) {
    if (key === 'nueva') this.addArea();
    if (key === 'guardar') this.saveAll();
  }

  addArea() {
    const tmp: Area = {
      id: 'tmp-' + Math.random().toString(36).slice(2, 9),
      nombre: '',
      ubicacion: '',
      abre: '08:00',
      cierra: '20:00',
      requiereReserva: true,
      capacidad: 1,
      estado: 'Activo',
      edit: true,
    };
    this.areas = [tmp, ...this.areas];
  }

  toggleEdit(a: Area) {
    a.edit = !a.edit;
  }

  remove(a: Area) {
    this.areas = this.areas.filter(x => x.id !== a.id);
  }

  saveRow(a: Area) {
    // Validaciones mínimas
    if (!a.nombre?.trim()) return;
    if (!a.abre || !a.cierra) return;
    a.nombre = a.nombre.trim();
    a.ubicacion = a.ubicacion?.trim();
    a.edit = false;
  }

  cancelRow(a: Area) {
    // Si es nuevo y cancelan, lo quitamos
    if (a.id.startsWith('tmp-')) {
      this.remove(a);
    } else {
      a.edit = false;
    }
  }

  saveAll() {
    // Aquí llamarías tu API para persistir cambios
    const payload = this.areas.map(({ edit, ...api }) => api);
    console.log('Guardar en backend:', payload);
    // Feedback visual simple: salir de modo edición
    this.areas = this.areas.map(a => ({ ...a, edit: false }));
  }
}
