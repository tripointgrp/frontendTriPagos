import { Component, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Estado = 'Pendiente' | 'Aprobado' | 'Rechazado';
type Metodo  = 'Transferencia' | 'Depósito' | 'Efectivo' | 'Tarjeta';

type Pago = {
  id: string;
  fecha: string;        // ISO
  unidad: string;       // A143 ...
  residente: string;
  descripcion: 'Mensualidad' | 'Reservación' | 'Multa' | 'Otro';
  metodo: Metodo;
  referencia?: string;
  monto: number;
  estado: Estado;
};

@Component({
  selector: 'admin-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './admin-reportes.component.html',
  styleUrls: ['./admin-reportes.component.scss']
})
export class AdminReportesComponent {
  usuario = 'Carlos';

  // Mock de datos (puedes traerlos de tu servicio)
  pagos: Pago[] = [
    { id:'p1', fecha:'2025-03-01', unidad:'A143', residente:'María', descripcion:'Mensualidad', metodo:'Transferencia', monto:550, estado:'Aprobado' },
    { id:'p2', fecha:'2025-03-02', unidad:'A163', residente:'Juan',   descripcion:'Mensualidad', metodo:'Depósito',      monto:550, estado:'Pendiente' },
    { id:'p3', fecha:'2025-03-03', unidad:'A123', residente:'Ana',    descripcion:'Multa',        metodo:'Efectivo',      monto:150, estado:'Aprobado' },
    { id:'p4', fecha:'2025-03-03', unidad:'A163', residente:'Juan',   descripcion:'Reservación',  metodo:'Tarjeta',       monto:200, estado:'Rechazado' },
    { id:'p5', fecha:'2025-03-05', unidad:'A143', residente:'María',  descripcion:'Mensualidad',  metodo:'Transferencia', monto:550, estado:'Aprobado' },
    { id:'p6', fecha:'2025-03-07', unidad:'A188', residente:'Luz',    descripcion:'Mensualidad',  metodo:'Depósito',      monto:550, estado:'Pendiente' },
  ];

  // Filtros (signals para reactividad simple)
  filtroDesde   = signal<string>('');
  filtroHasta   = signal<string>('');
  filtroEstado  = signal<Estado | ''>('');
  filtroTipo    = signal<Pago['descripcion'] | ''>('');
  filtroMetodo  = signal<Metodo | ''>('');
  filtroUnidad  = signal<string>('');

  // Datos filtrados
  filtrados = computed(() => {
    const d = this.filtroDesde();  const h = this.filtroHasta();
    const e = this.filtroEstado(); const t = this.filtroTipo();
    const m = this.filtroMetodo(); const u = this.filtroUnidad().toLowerCase().trim();

    return this.pagos.filter(p => {
      const fechaOk =
        (!d || p.fecha >= d) &&
        (!h || p.fecha <= h);
      const estadoOk = !e || p.estado === e;
      const tipoOk   = !t || p.descripcion === t;
      const metOk    = !m || p.metodo === m;
      const unidadOk = !u || p.unidad.toLowerCase().includes(u);
      return fechaOk && estadoOk && tipoOk && metOk && unidadOk;
    });
  });

  // KPIs
  kpiAprobado = computed(() => this.filtrados().filter(p => p.estado==='Aprobado').reduce((s,p)=>s+p.monto,0));
  kpiPend     = computed(() => this.filtrados().filter(p => p.estado==='Pendiente').reduce((s,p)=>s+p.monto,0));
  kpiRech     = computed(() => this.filtrados().filter(p => p.estado==='Rechazado').reduce((s,p)=>s+p.monto,0));
  kpiTotal    = computed(() => this.filtrados().reduce((s,p)=>s+p.monto,0));
  kpiCount    = computed(() => this.filtrados().length);

  // Serie por día (para mini chart)
  seriePorDia = computed(() => {
    const mapa = new Map<string, number>();
    for (const p of this.filtrados()) {
      mapa.set(p.fecha, (mapa.get(p.fecha) || 0) + p.monto);
    }
    // Orden ascendente por fecha
    return Array.from(mapa.entries()).sort(([a],[b]) => a.localeCompare(b));
  });

  // Helpers mini‑chart
  getChartPoints(): string {
    const data = this.seriePorDia();
    if (!data.length) return '';
    const w = 360, h = 140, pad = 10;
    const max = Math.max(...data.map(([,v]) => v), 1);
    const stepX = (w - pad*2) / Math.max(data.length - 1, 1);

    return data.map(([_, v], i) => {
      const x = pad + i * stepX;
      const y = pad + (1 - v/max) * (h - pad*2);
      return `${x},${y}`;
    }).join(' ');
  }

  // Acciones
  limpiarFiltros() {
    this.filtroDesde.set('');
    this.filtroHasta.set('');
    this.filtroEstado.set('');
    this.filtroTipo.set('');
    this.filtroMetodo.set('');
    this.filtroUnidad.set('');
  }

  generarReporte() {
    // Aquí luego llamamos a CsvService / PDF service.
    // Por ahora, solo mostramos en consola.
    console.log('Generar reporte con', this.filtrados());
  }
}
