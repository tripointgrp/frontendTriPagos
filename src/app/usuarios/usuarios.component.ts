import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);

  usuarios: any[] = [];
  nuevoUsuario: any = {};
  editando: any = null;

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.usuarios = await this.usuariosService.obtenerUsuarios();
  }

  async guardarUsuario() {
    if (this.editando) {
      await this.usuariosService.actualizarUsuario(this.editando.id, this.nuevoUsuario);
    } else {
      await this.usuariosService.agregarUsuario(this.nuevoUsuario);
    }
    this.nuevoUsuario = {};
    this.editando = null;
    await this.cargarUsuarios();
  }

  editarUsuario(usuario: any) {
    this.nuevoUsuario = { ...usuario };
    this.editando = usuario;
  }

  async eliminarUsuario(id: string) {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      await this.usuariosService.eliminarUsuario(id);
      await this.cargarUsuarios();
    }
  }
}
