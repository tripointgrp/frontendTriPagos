import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { PhoneAppBarComponent } from '../components/phone-app-bar/phone-app-bar.component';
@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [RouterModule, CommonModule,PhoneAppBarComponent],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.scss'
})
export class NotificacionesComponent {
  activeTab: 'notificaciones' | 'notificar' = 'notificaciones';

  notificaciones = [
    {
      fecha: '15 Mar, 2025',
      emisor: 'Administración',
      mensaje: 'Jueves 17 de marzo de 8 a.m. a 12 p.m. no habrá energía en el condominio por mantenimiento'
    }
  ];
}
