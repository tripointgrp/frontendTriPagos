import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidenciasService } from '../services/residencias.service';

@Component({
  selector: 'app-residencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './residencias.component.html',
  styleUrls: ['./residencias.component.scss']
})
export class ResidenciasComponent implements OnInit {
  private residenciasService = inject(ResidenciasService);

  residencias: any[] = [];
  unidades: any[] = []; // Para select de unidades
  nuevaResidencia: any = {};
  editando: any = null;
  showModal = false;

  torresDisponibles: any[] = [];

  async ngOnInit() {
    await this.cargarResidencias();
    await this.cargarUnidades();
  }

  async cargarResidencias() {
    this.residencias = await this.residenciasService.obtenerResidencias();
  }

  async cargarUnidades() {
    this.unidades = await this.residenciasService.obtenerUnidadesActivas();
  }

  async guardarResidencia() {
    if (!this.nuevaResidencia.codigo_residencia || !this.nuevaResidencia.unidadId) {
      alert('Código y Unidad son obligatorios');
      return;
    }

    if (this.editando) {
      await this.residenciasService.actualizarResidencia(this.editando.id, this.nuevaResidencia);
    } else {
      this.nuevaResidencia.estado = this.nuevaResidencia.estado || 'activo';
      await this.residenciasService.agregarResidencia(this.nuevaResidencia);
    }

    this.resetForm();
    this.showModal = false;
    await this.cargarResidencias();
  }

  editarResidencia(residencia: any) {
    this.nuevaResidencia = { ...residencia };
    this.editando = residencia;
    this.showModal = true;
    this.cargarTorresDeUnidad(residencia.unidadId);
  }

  async eliminarResidencia(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta residencia?')) {
      await this.residenciasService.eliminarResidencia(id);
      await this.cargarResidencias();
    }
  }

  async toggleEstado(residencia: any) {
    const nuevoEstado = residencia.estado === 'activo' ? 'inactivo' : 'activo';
    await this.residenciasService.actualizarResidencia(residencia.id, { estado: nuevoEstado });
    residencia.estado = nuevoEstado;
  }

  resetForm() {
    this.nuevaResidencia = { codigo_residencia: '', unidadId: '', torre: '', estado: 'activo' };
    this.torresDisponibles = [];
    this.editando = null;
  }

  cargarTorresDeUnidad(unidadId: string) {
    const unidad = this.unidades.find(u => u.id === unidadId);
    this.torresDisponibles = unidad && Array.isArray(unidad.torres) ? unidad.torres : [];
  }

  getNombreUnidad(unidadId: string): string {
  if (!unidadId || !this.unidades) return '—';
  const unidad = this.unidades.find(u => u.id === unidadId);
  return unidad ? unidad.nombre : '—';
}

}
