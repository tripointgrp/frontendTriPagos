import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);

  usuarios: any[] = [];
  roles: any[] = [];
  nuevoUsuario: any = {};
  editando: any = null;
  showModal = false;
  residencias: any[] = [];
  rolVecinoOpciones = ['dueño', 'inquilino', 'otro'];

  async ngOnInit() {
    await this.cargarUsuarios();
    await this.cargarRoles();
    await this.cargarResidencias();
  }

  async cargarResidencias() {
    const raw = await this.usuariosService.obtenerResidenciasActivasConUnidad();
    this.residencias = raw.map((r) => ({
      ...r,
      displayName: `${r.codigo_residencia || '—'} / ${r.unidad?.nombre || '—'}`,
    }));
  }

  async cargarUsuarios() {
    this.usuarios = await this.usuariosService.obtenerUsuarios();
  }

  async cargarRoles() {
    this.roles = await this.usuariosService.obtenerRolesActivos();
    console.log('Roles activos cargados:', this.roles);
  }

  getNombreRol(rolId: string): string {
    if (!rolId) return '—';
    const rol = this.roles.find((r) => r.id === rolId);
    return rol ? rol.nombre : '—';
  }

  getNombreResidencia(residenciaId: string): string {
    if (!residenciaId) return '—';

    const res = this.residencias.find((r) => r.id === residenciaId);
    if (!res) return '—';

    // usar código_residencia si existe, sino fallback a nombre
    const codigo = res.codigo_residencia || res.nombre || '—';
    const unidad = res.unidad?.nombre || '—';

    return `${codigo} / ${unidad}`;
  }

  /** Guardar (crear/actualizar) */
  async guardarUsuario() {
    if (
      !this.nuevoUsuario.nombre ||
      !this.nuevoUsuario.email ||
      !this.nuevoUsuario.rolId
    ) {
      alert('Nombre, Email y Rol son obligatorios');
      return;
    }

    // Normalizar campos de texto
    this.nuevoUsuario.nombre = String(this.nuevoUsuario.nombre).trim();
    this.nuevoUsuario.email = String(this.nuevoUsuario.email).trim();

    // Si password viene vacío, no lo mandamos (para no sobreescribir)
    if (
      this.nuevoUsuario.password === '' ||
      this.nuevoUsuario.password === undefined ||
      this.nuevoUsuario.password === null
    ) {
      delete this.nuevoUsuario.password;
    }

    if (this.editando) {
      await this.usuariosService.actualizarUsuario(
        this.editando.id,
        this.nuevoUsuario
      );
    } else {
      this.nuevoUsuario.estado = this.nuevoUsuario.estado || 'Activo';
      await this.usuariosService.agregarUsuario(this.nuevoUsuario);
    }

    this.resetForm();
    this.showModal = false;
    await this.cargarUsuarios();
  }

  /** Editar: prellenar sin exponer hash, password vacío */
  editarUsuario(usuario: any) {
    const {
      nombre,
      email,
      rolId,
      username,
      estado,
      residenciaId,
      rol_vecino,
      // ignoramos passwordHash y otros campos internos
    } = usuario;

    this.nuevoUsuario = {
      nombre: nombre || '',
      email: email || '',
      rolId: rolId || '',
      username: username || '',
      password: '', // importante: vacía para no sobreescribir hasta que el admin digite una nueva
      estado: estado || 'Activo',
      residenciaId: residenciaId || '',
      rol_vecino: rol_vecino || '',
    };

    this.editando = usuario;
    this.showModal = true;
  }

  /** Eliminar */
  async eliminarUsuario(id: string) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      await this.usuariosService.eliminarUsuario(id);
      await this.cargarUsuarios();
    }
  }

  /** Toggle estado desde la tabla */
  async toggleEstado(usuario: any) {
    const nuevoEstado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
    await this.usuariosService.actualizarUsuario(usuario.id, {
      ...usuario,
      estado: nuevoEstado,
    });
    usuario.estado = nuevoEstado; // reflejar en UI sin recargar todo
  }

  /** Reset modal/form */
  resetForm() {
    this.nuevoUsuario = {
      nombre: '',
      email: '',
      rolId: '',
      username: '',
      password: '',
      estado: 'Activo',
      residenciaId: '',
      rol_vecino: '',
    };
    this.editando = null;
  }
}
