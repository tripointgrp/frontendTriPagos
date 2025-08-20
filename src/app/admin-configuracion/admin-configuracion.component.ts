import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type BankAccount = {
  banco: string;
  nombre: string;
  numero: string;
  tipo: 'Monetaria' | 'Ahorro' | 'Cheques';
};

type GeneralSettings = {
  nombreCondominio: string;
  moneda: 'Q' | '$' | '€' | '₡' | 'S/';
  formatoFecha: 'dd-MM-y' | 'MM-dd-y' | 'y-MM-dd';
  zonaHoraria: string;
};

type PaymentSettings = {
  metodos: { transferencia: boolean; deposito: boolean; efectivo: boolean; tarjeta: boolean };
  cuentas: BankAccount[];
  diaVencimiento: number;     // 1-28
  diasTolerancia: number;     // 0..31
  recargoPorMora: number;     // Q
  porcentajeMora?: number;    // %
  montoCuota?: number;        // Q, opcional si varía por unidad
};

type NotificationSettings = {
  canales: { email: boolean; push: boolean; whatsapp: boolean };
  remitenteCorreo: string;
  plantillaPagoAprobado: string;
  plantillaCorte: string;
};

type Amenidad = {
  id: string;
  nombre: string;
  horario: string;    // "08:00 - 20:00"
  aforo: number;
  costo?: number;     // Q, si aplica
  reglas?: string;
  habilitada: boolean;
};

type ReservationsSettings = {
  habilitadas: boolean;
  amenidades: Amenidad[];
  anticipacionMinHoras: number; // horas mínimas para reservar
  maxHorasPorDia: number;       // límite por usuario/unidad
};

type IntegrationsSettings = {
  smtpHost: string; smtpPort: number; smtpUser: string; smtpFrom: string;
  whatsappWebhookUrl: string;
};

@Component({
  selector: 'admin-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './admin-configuracion.component.html',
  styleUrls: ['./admin-configuracion.component.scss']
})
export class AdminConfiguracionComponent {
  usuario = 'Carlos';
  // navegación por pestañas
  tab: 'general' | 'pagos' | 'notificaciones' | 'reservaciones' | 'integraciones' = 'general';

  /* ================== Estado (mock inicial) ================== */
  general: GeneralSettings = {
    nombreCondominio: 'AMI APARTAMENTOS',
    moneda: 'Q',
    formatoFecha: 'dd-MM-y',
    zonaHoraria: 'America/Guatemala',
  };

  pagos: PaymentSettings = {
    metodos: { transferencia: true, deposito: true, efectivo: true, tarjeta: false },
    cuentas: [
      { banco: 'Banco Industrial', nombre: 'AMI APARTAMENTOS', numero: '123-456789-0', tipo: 'Monetaria' }
    ],
    diaVencimiento: 5,
    diasTolerancia: 3,
    recargoPorMora: 50,
    porcentajeMora: 0,
    montoCuota: 550,
  };

  notificaciones: NotificationSettings = {
    canales: { email: true, push: true, whatsapp: false },
    remitenteCorreo: 'no-reply@tripagos.app',
    plantillaPagoAprobado: 'Tu pago ha sido aprobado. ¡Gracias!',
    plantillaCorte: 'Tienes saldo pendiente. Evita recargos realizando tu pago.',
  };

  reservaciones: ReservationsSettings = {
    habilitadas: true,
    amenidades: [
      { id: 'a1', nombre: 'Salón Social',  horario: '08:00 - 22:00', aforo: 60, costo: 200, reglas: 'No fumar. Música hasta 21:00.', habilitada: true },
      { id: 'a2', nombre: 'Cancha de tenis', horario: '07:00 - 20:00', aforo: 4,  costo: 0,   reglas: 'Máximo 2 horas por día.', habilitada: true },
    ],
    anticipacionMinHoras: 4,
    maxHorasPorDia: 3,
  };

  integraciones: IntegrationsSettings = {
    smtpHost: 'smtp.mi-dominio.com',
    smtpPort: 587,
    smtpUser: 'apikey',
    smtpFrom: 'TriPagos <no-reply@tripagos.app>',
    whatsappWebhookUrl: '',
  };

  /* ================== Cuentas bancarias ================== */
  nuevaCuenta: BankAccount = { banco: '', nombre: '', numero: '', tipo: 'Monetaria' };
  addCuenta() {
    if (!this.nuevaCuenta.banco || !this.nuevaCuenta.numero) return;
    this.pagos.cuentas = [...this.pagos.cuentas, { ...this.nuevaCuenta }];
    this.nuevaCuenta = { banco: '', nombre: '', numero: '', tipo: 'Monetaria' };
  }
  delCuenta(i: number) { this.pagos.cuentas = this.pagos.cuentas.filter((_, idx) => idx !== i); }

  /* ================== Amenidades (CRUD simple con modal) ================== */
  amenityModalOpen = false;
  editingAmenityIndex: number | null = null;
  amenityForm: Amenidad = { id: '', nombre: '', horario: '08:00 - 20:00', aforo: 0, costo: 0, reglas: '', habilitada: true };

  openAmenityModal(editIndex: number | null = null) {
    this.editingAmenityIndex = editIndex;
    if (editIndex === null) {
      this.amenityForm = { id: 'am-' + Math.random().toString(36).slice(2, 9), nombre: '', horario: '08:00 - 20:00', aforo: 1, costo: 0, reglas: '', habilitada: true };
    } else {
      this.amenityForm = { ...this.reservaciones.amenidades[editIndex] };
    }
    this.amenityModalOpen = true;
  }
  closeAmenityModal() { this.amenityModalOpen = false; }

  saveAmenity() {
    if (!this.amenityForm.nombre || !this.amenityForm.horario || !this.amenityForm.aforo) return;
    if (this.editingAmenityIndex === null) {
      this.reservaciones.amenidades = [ { ...this.amenityForm }, ...this.reservaciones.amenidades ];
    } else {
      const idx = this.editingAmenityIndex;
      this.reservaciones.amenidades = this.reservaciones.amenidades.map((a, i) => i === idx ? { ...this.amenityForm } : a);
    }
    this.amenityModalOpen = false;
  }
  delAmenity(i: number) { this.reservaciones.amenidades = this.reservaciones.amenidades.filter((_, idx)=> idx!==i); }

  /* ================== Acciones globales ================== */
  saving = false;
  saveAll() {
    this.saving = true;
    // Aquí llamarías a tu API. Simulamos:
    setTimeout(() => { this.saving = false; alert('Configuración guardada ✅'); }, 500);
  }
  resetAll() {
    if (!confirm('¿Restablecer cambios no guardados?')) return;
    // En una app real, recargarías desde el backend los valores persistidos.
    window.location.reload();
  }
}
