import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApartamentosService } from '../services/apartamentos.service';

@Component({
  selector: 'app-apartamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apartamentos.component.html',
  styleUrls: ['./apartamentos.component.scss']
})
export class ApartamentosComponent implements OnInit {
  private apartamentosService = inject(ApartamentosService);

  apartamentos: any[] = [];
  nuevoApartamento: any = {};
  editando: any = null;

  async ngOnInit() {
    await this.cargarApartamentos();
  }

  async cargarApartamentos() {
    this.apartamentos = await this.apartamentosService.obtenerApartamentos();
  }

  async guardarApartamento() {
    if (!this.nuevoApartamento.nombre || !this.nuevoApartamento.alias) {
      alert('El nombre y alias son obligatorios');
      return;
    }

    if (this.editando) {
      // Actualizar
      await this.apartamentosService.actualizarApartamento(this.editando.id, this.nuevoApartamento);
    } else {
      // Insertar nuevo
      await this.apartamentosService.agregarApartamento(this.nuevoApartamento);
    }

    this.resetForm();
    await this.cargarApartamentos();
  }

  editarApartamento(apto: any) {
    this.nuevoApartamento = { ...apto };
    this.editando = apto;
  }

  async eliminarApartamento(id: string) {
    if (confirm('¿Seguro que deseas eliminar este apartamento?')) {
      await this.apartamentosService.eliminarApartamento(id);
      await this.cargarApartamentos();
    }
  }

  resetForm() {
    this.nuevoApartamento = {
      nombre: '',
      alias: '',
      direccion: '',
      telefono: '',
      administrador: '',
      num_unidades: null,
      estado: 'activo'
    };
    this.editando = null;
  }
}
