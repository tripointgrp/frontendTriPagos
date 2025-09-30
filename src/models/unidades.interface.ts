export interface Unidad {
  id?: string;                // Firestore ID
  nombre: string;             // Nombre oficial del condominio
  alias?: string;             // Nombre corto
  direccion: string;
  nombre_contacto?: string;
  telefono_contacto?: string;
  email_contacto?: string;
  nombre_representante?: string;
  nit_representante?: string;
  dpi_representante?: string;
  administrador?: string;     // id usuario administrador
  tipo_unidad: 'condominio' | 'colonia' | 'apartamentos' | 'villas';
  torres_total?: number;
  unidades_total?: number;
  unidades_por_tipo?: { [tipo: string]: number };
  torres?: Array<{ nombre: string; unidades_total: number; unidades_por_tipo?: { [tipo: string]: number } }>;
  parqueos?: string[];        // o cantidad
  cuota_mantenimiento?: number;
  moneda?: 'GTQ' | 'USD' | string;
  periodicidad?: string;
  dia_corte?: number;
  dia_vencimiento?: number;
  gracia_dias?: number;
  recargo_tipo?: 'porcentaje' | 'monto_fijo';
  recargo_valor?: number;
  estado: 'activo' | 'inactivo';
  notas?: string;
  razon_social?: string;
  nit?: string;
  fecha_creacion?: any;
  fecha_actualizacion?: any;
}
