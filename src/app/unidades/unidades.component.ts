import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnidadesService } from '../services/unidades.service';
import { NgSelectModule } from '@ng-select/ng-select';

type TipoUnidadRow = { tipo: string; cantidad: number };
type TorreRow = { nombre: string; unidades_total: number };

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.scss']
})
export class UnidadesComponent implements OnInit {
  private unidadesService = inject(UnidadesService);

  unidades: any[] = [];
  usuariosActivos: any[] = []; // 🔹 lista de usuarios activos
  nuevaUnidad: any = {};
  editando: any = null;
  showModal = false;

  // Edición avanzada
  tiposUnidades: TipoUnidadRow[] = [];
  torres: TorreRow[] = [];

  parqueosModo: 'cantidad' | 'codigos' = 'cantidad';
  parqueosCantidad: number | null = null;
  parqueosCodigos: string[] = [];

  async ngOnInit() {
    await this.cargarUnidades();
    await this.cargarUsuariosActivos();
  }

  async cargarUnidades() {
    this.unidades = await this.unidadesService.obtenerUnidades();
    console.log('Unidades cargadas:', this.unidades);
  }

  async cargarUsuariosActivos() {
    this.usuariosActivos = await this.unidadesService.obtenerUsuariosActivos();
    console.log('Usuarios activos cargados:', this.usuariosActivos);
  }

  /** Guardar/Actualizar */
  async guardarUnidad() {
    // Validaciones base
    if (!this.nuevaUnidad.nombre || !this.nuevaUnidad.tipo_unidad || !this.nuevaUnidad.direccion) {
      alert('Nombre, tipo de unidad y dirección son obligatorios');
      return;
    }

    // Construir payload limpio
    const payload: any = { ...this.nuevaUnidad };

    // Normalizar números
    ['torres_total', 'unidades_total', 'cuota_mantenimiento', 'gracia_dias', 'dia_corte', 'dia_vencimiento', 'recargo_valor']
      .forEach(k => {
        if (payload[k] !== undefined && payload[k] !== null && payload[k] !== '') {
          payload[k] = Number(payload[k]);
        } else {
          delete payload[k];
        }
      });

    // unidades_por_tipo: array -> objeto
    if (this.tiposUnidades.length) {
      const obj: Record<string, number> = {};
      this.tiposUnidades
        .filter((r) => r.tipo && r.cantidad !== undefined && r.cantidad !== null)
        .forEach((r) => (obj[r.tipo.trim()] = Number(r.cantidad)));
      payload.unidades_por_tipo = Object.keys(obj).length ? obj : undefined;
    } else {
      delete payload.unidades_por_tipo;
    }

    // torres: array simple
    payload.torres = this.torres
      .filter(t => t.nombre && t.unidades_total !== undefined && t.unidades_total !== null)
      .map(t => ({ nombre: t.nombre.trim(), unidades_total: Number(t.unidades_total) }));
    if (!payload.torres.length) delete payload.torres;

    // parqueos: cantidad o códigos
    if (this.parqueosModo === 'cantidad') {
      payload.parqueos = this.parqueosCantidad !== null && this.parqueosCantidad !== undefined
        ? Number(this.parqueosCantidad)
        : undefined;
    } else {
      payload.parqueos = this.parqueosCodigos.length ? [...this.parqueosCodigos] : undefined;
    }

    // Estado
    payload.estado = payload.estado || 'activo';
    console.log(payload);
    if (this.editando) {
      await this.unidadesService.actualizarUnidad(this.editando.id, payload);
    } else {
      await this.unidadesService.agregarUnidad(payload);
    }

    this.resetForm();
    this.showModal = false;
    await this.cargarUnidades();
  }

  /** Editar: cargar estructuras complejas a los editores */
  editarUnidad(unidad: any) {
    this.nuevaUnidad = { ...unidad };
    this.editando = unidad;
    this.showModal = true;

    // unidades_por_tipo (obj -> array)
    this.tiposUnidades = [];
    if (unidad.unidades_por_tipo && typeof unidad.unidades_por_tipo === 'object') {
      this.tiposUnidades = Object.entries(unidad.unidades_por_tipo).map(([tipo, cantidad]) => ({
        tipo,
        cantidad: Number(cantidad as any)
      }));
    }

    // torres
    this.torres = Array.isArray(unidad.torres) ? unidad.torres.map((t: any) => ({
      nombre: t.nombre || '',
      unidades_total: Number(t.unidades_total || 0)
    })) : [];

    // parqueos (número o array)
    if (Array.isArray(unidad.parqueos)) {
      this.parqueosModo = 'codigos';
      this.parqueosCodigos = [...unidad.parqueos];
      this.parqueosCantidad = null;
    } else if (typeof unidad.parqueos === 'number') {
      this.parqueosModo = 'cantidad';
      this.parqueosCantidad = unidad.parqueos;
      this.parqueosCodigos = [];
    } else {
      this.parqueosModo = 'cantidad';
      this.parqueosCantidad = null;
      this.parqueosCodigos = [];
    }
  }

  /** Eliminar */
  async eliminarUnidad(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta unidad?')) {
      await this.unidadesService.eliminarUnidad(id);
      await this.cargarUnidades();
    }
  }

  /** Toggle estado desde tabla */
  async toggleEstado(unidad: any) {
    const nuevoEstado = unidad.estado === 'activo' ? 'inactivo' : 'activo';
    await this.unidadesService.actualizarUnidad(unidad.id, { estado: nuevoEstado });
    unidad.estado = nuevoEstado;
  }

  /** Helpers UI: unidades_por_tipo */
  addTipo() { this.tiposUnidades.push({ tipo: '', cantidad: 0 }); }
  removeTipo(i: number) { this.tiposUnidades.splice(i, 1); }

  /** Helpers UI: torres */
  addTorre() { this.torres.push({ nombre: '', unidades_total: 0 }); }
  removeTorre(i: number) { this.torres.splice(i, 1); }

  /** Helpers UI: parqueos códigos */
  addParqueoCodigo(ev: any) {
    ev.preventDefault();
    const input = ev.target as HTMLInputElement;
    const val = (input.value || '').trim();
    if (val) {
      if (!this.parqueosCodigos.includes(val)) {
        this.parqueosCodigos.push(val);
      }
      input.value = '';
    }
  }

  removeParqueoCodigo(i: number) { this.parqueosCodigos.splice(i, 1); }

  /** Reset modal/form */
  resetForm() {
    this.nuevaUnidad = {
      nombre: '',
      alias: '',
      direccion: '',
      nombre_contacto: '',
      telefono_contacto: '',
      email_contacto: '',
      nombre_representante: '',
      nit_representante: '',
      dpi_representante: '',
      administrador: '',
      tipo_unidad: '',
      torres_total: null,
      unidades_total: null,
      unidades_por_tipo: undefined,
      torres: undefined,
      // cobros
      cuota_mantenimiento: null,
      moneda: 'GTQ',
      periodicidad: 'mensual',
      dia_corte: null,
      dia_vencimiento: null,
      gracia_dias: 0,
      recargo_tipo: '',
      recargo_valor: null,
      // otros
      estado: 'activo'
    };

    this.tiposUnidades = [];
    this.torres = [];
    this.parqueosModo = 'cantidad';
    this.parqueosCantidad = null;
    this.parqueosCodigos = [];
    this.editando = null;
  }
}
