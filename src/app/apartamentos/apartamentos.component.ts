import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnidadesService } from '../services/unidades.service';

export interface Unidad {
  _id?: string;
  nombre: string;
  alias: string;
  direccion?: string;
  telefono_contacto?: string;
  administrador?: string;

  tipo_unidad: 'condominio'|'colonia'|'apartamentos'|'villas'|'otro';
  torres_total?: number;

  unidades_por_tipo: {
    casas?: number;
    apartamentos?: number;
    locales?: number;
    [k: string]: number | undefined;
  };
  unidades_total?: number;

  cuota_mantenimiento: number;
  moneda: 'GTQ'|'USD';
  periodicidad?: 'mensual'|'bimestral'|'trimestral';
  dia_corte?: number;
  dia_vencimiento?: number;
  gracia_dias?: number;

  recargo_tipo?: ''|'porcentaje'|'monto_fijo';
  recargo_valor?: number;

  estado: 'activo'|'inactivo';
  notas?: string;

  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

@Component({
  selector: 'app-apartamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apartamentos.component.html',
  styleUrls: ['./apartamentos.component.scss']
})
export class ApartamentosComponent implements OnInit {
 private unidadesService = inject(UnidadesService);

  unidades: Unidad[] = [];
  unidad: Unidad = this.getDefaultUnidad();
  editando: Unidad | null = null;

  async ngOnInit() {
    await this.cargarUnidades();
  }

  getDefaultUnidad(): Unidad {
    return {
      nombre: '',
      alias: '',
      direccion: '',
      telefono_contacto: '',
      administrador: '',
      tipo_unidad: 'apartamentos',
      torres_total: 0,
      unidades_por_tipo: { casas: 0, apartamentos: 0, locales: 0 },
      unidades_total: 0,
      cuota_mantenimiento: 0,
      moneda: 'GTQ',
      periodicidad: 'mensual',
      dia_corte: 1,
      dia_vencimiento: 10,
      gracia_dias: 0,
      recargo_tipo: '',
      recargo_valor: 0,
      estado: 'activo',
      notas: ''
    };
  }

  async cargarUnidades() {
    this.unidades = await this.unidadesService.obtenerUnidades();
  }

  recalcularTotal() {
    const upt = this.unidad.unidades_por_tipo || {};
    const suma =
      (Number(upt.casas) || 0) +
      (Number(upt.apartamentos) || 0) +
      (Number(upt.locales) || 0);
    this.unidad.unidades_total = suma;
  }

  async guardarUnidad() {
    if (!this.unidad.nombre?.trim() || !this.unidad.alias?.trim()) {
      alert('El nombre y alias son obligatorios');
      return;
    }
    this.recalcularTotal();

    if (this.editando?._id) {
      await this.unidadesService.actualizarUnidad(this.editando._id, this.unidad);
    } else {
      await this.unidadesService.agregarUnidad(this.unidad);
    }

    this.resetForm();
    await this.cargarUnidades();
  }

  editarUnidad(u: Unidad) {
    // Clonar para no mutar la fila
    this.unidad = JSON.parse(JSON.stringify(u));
    // Defaults por si vienen vacíos
    this.unidad.unidades_por_tipo = {
      casas: this.unidad.unidades_por_tipo?.casas || 0,
      apartamentos: this.unidad.unidades_por_tipo?.apartamentos || 0,
      locales: this.unidad.unidades_por_tipo?.locales || 0
    };
    this.recalcularTotal();
    this.editando = u;
  }

  async eliminarUnidad(id?: string) {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar esta unidad?')) {
      await this.unidadesService.eliminarUnidad(id);
      await this.cargarUnidades();
    }
  }

  resetForm() {
    this.unidad = this.getDefaultUnidad();
    this.editando = null;
  }
}
