import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  private rolesService = inject(RolesService);

  roles: any[] = [];
  nuevoRol: any = { nombre: '', descripcion: '', permisos: [] };
  editando: any = null;
  showModal = false;

  permisosDisponibles = ['Agregar', 'Editar', 'Eliminar', 'Ver'];

  async ngOnInit() {
    await this.cargarRoles();
  }

  /** 🔄 Cargar roles desde Firestore */
  async cargarRoles() {
    this.roles = await this.rolesService.obtenerRoles();
  }

  /** ✅ Verificar si un permiso ya está marcado */
  tienePermiso(permiso: string): boolean {
    return this.nuevoRol.permisos && this.nuevoRol.permisos.includes(permiso);
  }

  /** 🔄 Agregar o quitar un permiso del rol actual */
  togglePermiso(permiso: string) {
    if (!this.nuevoRol.permisos) {
      this.nuevoRol.permisos = [];
    }
    if (this.nuevoRol.permisos.includes(permiso)) {
      this.nuevoRol.permisos = this.nuevoRol.permisos.filter((p: string) => p !== permiso);
    } else {
      this.nuevoRol.permisos.push(permiso);
    }
  }

  /** 💾 Guardar (crear o actualizar) rol */
  async guardarRol() {
    if (!this.nuevoRol.nombre) {
      alert('El nombre del rol es obligatorio');
      return;
    }

    if (!this.nuevoRol.permisos || this.nuevoRol.permisos.length === 0) {
      alert('Debes asignar al menos un permiso');
      return;
    }

    if (this.editando) {
      await this.rolesService.actualizarRol(this.editando.id, this.nuevoRol);
    } else {
      await this.rolesService.agregarRol(this.nuevoRol);
    }

    await this.cargarRoles();
    this.resetForm();
    this.showModal = false;
  }

  /** ✏️ Editar rol existente */
  editarRol(rol: any) {
    this.nuevoRol = { ...rol };
    this.editando = rol;
  }

  /** ❌ Eliminar rol */
  async eliminarRol(id: string) {
    if (confirm('¿Seguro que deseas eliminar este rol?')) {
      await this.rolesService.eliminarRol(id);
      await this.cargarRoles();
    }
  }

  /** 🔄 Resetear formulario */
  resetForm() {
    this.nuevoRol = { nombre: '', descripcion: '', permisos: [] };
    this.editando = null;
  }
}
