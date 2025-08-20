import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Estado = 'Pendiente' | 'Aprobado' | 'Rechazado';
type Metodo  = 'Transferencia' | 'Depósito' | 'Efectivo' | 'Tarjeta';

type Pago = {
  id: string;
  fecha: string;       // ISO
  unidad: string;      // cliente o apartamento
  residente: string;   // "—" si no se conoce
  descripcion: string; // Mensualidad/Reservación/Multa/...
  metodo: Metodo;
  referencia?: string; // boleta / txn
  monto: number;
  estado: Estado;
  adjuntoNombre?: string;
  notas?: string;
};

@Component({
  selector: 'admin-pagos',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './admin-pagos.component.html',
  styleUrls: ['./admin-pagos.component.scss']
})
export class AdminPagosComponent {
  usuario = 'Carlos';

  acciones = [
    { label: 'Registrar Pago',         action: 'nuevo' },
    { label: 'Aprobar Seleccionados',  action: 'aprobar' },
    { label: 'Rechazar Seleccionados', action: 'rechazar' },
    { label: 'Importar CSV',           action: 'importar' },
    { label: 'Exportar',               action: 'exportar' },
    { label: 'Historial',              action: 'historial' },
  ];

  pagos: Pago[] = [
    { id:'p1', fecha:'2025-03-03', unidad:'A143', residente:'María López', descripcion:'Mensualidad', metodo:'Transferencia', referencia:'TRX-90821', monto:550, estado:'Aprobado' },
    { id:'p2', fecha:'2025-03-03', unidad:'A163', residente:'Juan Pérez',  descripcion:'Mensualidad', metodo:'Depósito',      referencia:'BOL-33102', monto:550, estado:'Pendiente' },
    { id:'p3', fecha:'2025-03-01', unidad:'A123', residente:'Ana García',  descripcion:'Mensualidad', metodo:'Efectivo',      referencia:'EF-1022',  monto:550, estado:'Rechazado', notas:'Boleta ilegible' },
  ];

  /* ===== Selección ===== */
  selectedIds = new Set<string>();

  isSelected(id: string) { return this.selectedIds.has(id); }
  toggleOne(id: string, checked: boolean) {
    if (checked) this.selectedIds.add(id);
    else this.selectedIds.delete(id);
  }

  private selectableIds(): string[] {
    // Seleccionables: solo Pendientes
    return this.pagos.filter(p => p.estado === 'Pendiente').map(p => p.id);
  }
  allSelected(): boolean {
    const ids = this.selectableIds();
    return ids.length > 0 && ids.every(id => this.selectedIds.has(id));
  }
  toggleAll(checked: boolean) {
    const ids = this.selectableIds();
    if (checked) ids.forEach(id => this.selectedIds.add(id));
    else ids.forEach(id => this.selectedIds.delete(id));
  }
  selectedCount() { return this.selectedIds.size; }
  selectedItems(): Pago[] { return this.pagos.filter(p => this.selectedIds.has(p.id)); }
  selectedAmount(): number { return this.selectedItems().reduce((s, p) => s + p.monto, 0); }

  /* ===== Registrar pago (modal simple) ===== */
  modalOpen = false;
  saving = false;
  form: { unidad: string; referencia: string; monto: number | null; descripcion: string; adjuntoNombre?: string } =
    { unidad:'', referencia:'', monto:null, descripcion:'' };

  onAccion(key: string) {
    if (key === 'nuevo') this.openModal();
    if (key === 'aprobar'  && this.selectedCount()) this.openApproveBulk();
    if (key === 'rechazar' && this.selectedCount()) this.openRejectBulk();
  }

  openModal(){ this.form = { unidad:'', referencia:'', monto:null, descripcion:'' }; this.modalOpen = true; }
  closeModal(){ if (!this.saving) this.modalOpen = false; }
  onAdjuntoChange(ev: Event){
    const f = (ev.target as HTMLInputElement).files?.[0];
    this.form.adjuntoNombre = f?.name;
  }
  save(){
    if (!this.form.unidad.trim() || !this.form.referencia.trim() || !this.form.monto) return;
    this.saving = true;
    const nuevo: Pago = {
      id: 'p-' + Math.random().toString(36).slice(2,9),
      fecha: new Date().toISOString(),
      unidad: this.form.unidad.trim(),
      residente: '—',
      descripcion: this.form.descripcion?.trim() || 'Mensualidad',
      metodo: 'Depósito',
      referencia: this.form.referencia.trim(),
      monto: Number(this.form.monto),
      estado: 'Pendiente',
      adjuntoNombre: this.form.adjuntoNombre
    };
    this.pagos = [nuevo, ...this.pagos];
    this.saving = false;
    this.modalOpen = false;
  }

  /* ===== Detalle individual ===== */
  detailOpen = false;
  selected: Pago | null = null;
  openDetail(p: Pago){ this.selected = { ...p }; this.detailOpen = true; }
  closeDetail(){ this.detailOpen = false; }

  /* ===== Aprob/Rechazo individual ===== */
  flowOpen: 'approve'|'reject'|'approve-bulk'|'reject-bulk'|null = null;
  decisionNotes = '';
  openApprove(p: Pago){ this.selected = p; this.decisionNotes=''; this.flowOpen='approve'; }
  openReject(p: Pago){  this.selected = p; this.decisionNotes=''; this.flowOpen='reject';  }
  closeDecision(){ this.flowOpen=null; this.selected=null; this.decisionNotes=''; }

  confirmApprove(){
    if (!this.selected) return;
    this.pagos = this.pagos.map(x => x.id === this.selected!.id ? { ...x, estado:'Aprobado', notas:this.decisionNotes || x.notas } : x);
    this.closeDecision();
  }
  confirmReject(){
    if (!this.selected) return;
    this.pagos = this.pagos.map(x => x.id === this.selected!.id ? { ...x, estado:'Rechazado', notas:this.decisionNotes || x.notas } : x);
    this.closeDecision();
  }

  /* ===== Lote ===== */
  openApproveBulk(){ this.flowOpen='approve-bulk'; this.decisionNotes=''; }
  openRejectBulk(){  this.flowOpen='reject-bulk';  this.decisionNotes=''; }

  confirmApproveBulk(){
    const ids = Array.from(this.selectedIds);
    if (!ids.length) return;
    this.pagos = this.pagos.map(p => ids.includes(p.id) && p.estado==='Pendiente'
      ? { ...p, estado:'Aprobado', notas:this.decisionNotes || p.notas } : p);
    this.selectedIds.clear();
    this.closeDecision();
  }
  confirmRejectBulk(){
    const ids = Array.from(this.selectedIds);
    if (!ids.length) return;
    this.pagos = this.pagos.map(p => ids.includes(p.id) && p.estado==='Pendiente'
      ? { ...p, estado:'Rechazado', notas:this.decisionNotes || p.notas } : p);
    this.selectedIds.clear();
    this.closeDecision();
  }

  
}
