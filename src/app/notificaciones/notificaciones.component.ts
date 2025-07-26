import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhoneAppBarComponent } from '../components/phone-app-bar/phone-app-bar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, PhoneAppBarComponent],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent {
  activeTab: 'notificaciones' | 'notificar' = 'notificar';

  notificaciones = [
    {
      fecha: '15 Mar, 2025',
      emisor: 'Administración',
      mensaje: 'Jueves 17 de marzo de 8 a.m. a 12 p.m. no habrá energía en el condominio por mantenimiento'
    }
  ];

  nuevoMensaje: string = '';
  imagenAdjunta: File | null = null;

  adjuntarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenAdjunta = input.files[0];
    } else {
      this.imagenAdjunta = null;
    }
  }

  enviarNotificacion(): void {
    if (!this.nuevoMensaje.trim()) {
      alert('El mensaje no puede estar vacío.');
      return;
    }

    const nueva = {
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      emisor: 'Tú',
      mensaje: this.nuevoMensaje
    };

    this.notificaciones.unshift(nueva);
    this.nuevoMensaje = '';
    this.imagenAdjunta = null;
    this.activeTab = 'notificaciones';

    alert('Notificación enviada ✅');
  }
}
