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
  nuevoRol: any = {};
  editando: any = null;

  permisosDisponibles = ['Agregar', 'Editar', 'Eliminar', 'Ver'];

  async ngOnInit() {
    await this.cargarRoles();
  }

  async cargarRoles() {
    this.roles = await this.rolesService.obtenerRoles();
  }

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

  tienePermiso(permiso: string) {
    return this.nuevoRol.permisos && this.nuevoRol.permisos.includes(permiso);
  }

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

    this.resetForm();
    await this.cargarRoles();
  }

  editarRol(rol: any) {
    this.nuevoRol = { ...rol };
    this.editando = rol;
  }

  async eliminarRol(id: string) {
    if (confirm('¿Seguro que deseas eliminar este rol?')) {
      await this.rolesService.eliminarRol(id);
      await this.cargarRoles();
    }
  }

  resetForm() {
    this.nuevoRol = { nombre: '', descripcion: '', permisos: [] };
    this.editando = null;
  }
}
