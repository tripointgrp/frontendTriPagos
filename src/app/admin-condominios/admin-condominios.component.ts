import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Condominio = {
  nombre: string;
  alias: string;
  direccion: string;
  unidades: number;
  administrador: string;   // contacto principal
  telefono?: string;
  email?: string;
};

@Component({
  selector: 'admin-condominios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-condominios.component.html',
  styleUrls: ['./admin-condominios.component.scss']
})
export class AdminCondominiosComponent {
  usuario = 'Carlos';

  acciones = [
    { label: 'Agregar Condominio', action: 'nuevo' },
    { label: 'Importar CSV',       action: 'importar' },
    { label: 'Exportar',           action: 'exportar' },
    { label: 'Configurar Cuotas',  action: 'cuotas' },
    { label: 'Historial',          action: 'historial' },
  ];

  condominios: Condominio[] = [
    { nombre: 'AMI Apartamentos', alias: 'AMI',  direccion: 'Calz. Central 12-34, Zona 4',  unidades: 180, administrador: 'Laura Méndez', telefono: '5555-1234', email: 'admin@ami.com' },
    { nombre: 'Jardines del Sol', alias: 'JDS',  direccion: 'Av. Reforma 5-10, Zona 9',     unidades: 96,  administrador: 'Mario Ruiz',   telefono: '5555-5678', email: 'contacto@jds.com' },
    { nombre: 'Torres Verona',    alias: 'VER',  direccion: '6a Av 10-22, Mixco',            unidades: 124, administrador: 'Ana Gómez',   telefono: '5555-9012', email: 'admin@verona.com' },
  ];

  onAccion(key: string) { console.log('Acción:', key); }
}

