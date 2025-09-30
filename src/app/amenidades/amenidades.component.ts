import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmenidadesService } from '../services/amenidades.service';

@Component({
  selector: 'app-amenidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './amenidades.component.html',
  styleUrls: ['./amenidades.component.scss']
})
export class AmenidadesComponent implements OnInit {
  private amenidadesService = inject(AmenidadesService);

  amenidades: any[] = [];
  nuevaAmenidad: any = {};
  editando: any = null;
  showModal = false;

  async ngOnInit() {
    await this.cargarAmenidades();
  }

  async cargarAmenidades() {
    this.amenidades = await this.amenidadesService.obtenerAmenidades();
  }

  async guardarAmenidad() {
    if (!this.nuevaAmenidad.nombre) {
      alert('El nombre de la amenidad es obligatorio');
      return;
    }

    if (this.editando) {
      await this.amenidadesService.actualizarAmenidad(this.editando.id, this.nuevaAmenidad);
    } else {
      this.nuevaAmenidad.estado = this.nuevaAmenidad.estado || 'activo';
      await this.amenidadesService.agregarAmenidad(this.nuevaAmenidad);
    }

    this.resetForm();
    this.showModal = false;
    await this.cargarAmenidades();
  }

  editarAmenidad(amenidad: any) {
    this.nuevaAmenidad = { ...amenidad };
    this.editando = amenidad;
    this.showModal = true;
  }

  async eliminarAmenidad(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta amenidad?')) {
      await this.amenidadesService.eliminarAmenidad(id);
      await this.cargarAmenidades();
    }
  }

  async toggleEstado(amenidad: any) {
    const nuevoEstado = amenidad.estado === 'activo' ? 'inactivo' : 'activo';
    await this.amenidadesService.actualizarAmenidad(amenidad.id, { estado: nuevoEstado });
    amenidad.estado = nuevoEstado;
  }

  resetForm() {
    this.nuevaAmenidad = {
      nombre: '',
      descripcion: '',
      ubicacion: '',
      costo: 0,
      capacidad: null,
      horario_inicio: '',
      horario_fin: '',
      requiere_reserva: false,
      restricciones: '',
      estado: 'activo'
    };
    this.editando = null;
  }
}
