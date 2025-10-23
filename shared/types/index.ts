// ============================================
// ENUMS Y CONSTANTES
// ============================================

export enum TipoDocumento {
  RNC = 'RNC',
  CEDULA = 'CEDULA',
}

export enum TipoNCF {
  CREDITO_FISCAL = 'CREDITO_FISCAL',
  GUBERNAMENTAL = 'GUBERNAMENTAL',
  CONSUMIDOR_FINAL = 'CONSUMIDOR_FINAL',
  NOTA_CREDITO = 'NOTA_CREDITO',
  NOTA_DEBITO = 'NOTA_DEBITO',
}

export enum RegimenFiscal {
  ORDINARIO = 'ORDINARIO',
  RST = 'RST',
  ESPECIAL = 'ESPECIAL',
}

export enum FormaPago {
  CONTADO = 'CONTADO',
  CREDITO = 'CREDITO',
  CUOTAS = 'CUOTAS',
  MIXTO = 'MIXTO',
}

export enum MedioPago {
  EFECTIVO = 'EFECTIVO',
  CHEQUE = 'CHEQUE',
  TRANSFERENCIA = 'TRANSFERENCIA',
  TARJETA = 'TARJETA',
  NOTA_CREDITO = 'NOTA_CREDITO',
  COMBINADO = 'COMBINADO',
}

export enum EstadoCotizacion {
  BORRADOR = 'BORRADOR',
  ENVIADA = 'ENVIADA',
  ACEPTADA = 'ACEPTADA',
  FACTURADA = 'FACTURADA',
  RECHAZADA = 'RECHAZADA',
  EXPIRADA = 'EXPIRADA',
}

export enum EstadoFactura {
  VIGENTE = 'VIGENTE',
  PAGADA = 'PAGADA',
  ANULADA = 'ANULADA',
  PARCIAL = 'PARCIAL',
}

export enum EstadoPago {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
  VENCIDA = 'VENCIDA',
  POR_VENCER = 'POR_VENCER',
  PARCIAL = 'PARCIAL',
}

export enum RolUsuario {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  VENDEDOR = 'VENDEDOR',
  CONTADOR = 'CONTADOR',
  ALMACENERO = 'ALMACENERO',
  COBRADOR = 'COBRADOR',
}

export enum TipoMovimientoInventario {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  DEVOLUCION = 'DEVOLUCION',
  AJUSTE = 'AJUSTE',
  MERMA = 'MERMA',
}

export enum TipoDescuento {
  VOLUMEN = 'VOLUMEN',
  CLIENTE_ESPECIAL = 'CLIENTE_ESPECIAL',
  PROMOCION = 'PROMOCION',
  MANUAL = 'MANUAL',
  DEFECTO = 'DEFECTO',
}

export enum AccionAuditoria {
  CREAR = 'CREAR',
  EDITAR = 'EDITAR',
  ELIMINAR = 'ELIMINAR',
  VER = 'VER',
  EXPORTAR = 'EXPORTAR',
  APROBAR = 'APROBAR',
  RECHAZAR = 'RECHAZAR',
  ANULAR = 'ANULAR',
}

// ============================================
// INTERFACES - CLIENTE
// ============================================

export interface Cliente {
  id: string;
  codigo: string; // CLI-001
  nombre: string;
  tipoDocumento: TipoDocumento;
  documento: string; // RNC o Cédula
  tipoNCF: TipoNCF;
  telefono?: string;
  direccion?: string;
  email?: string;
  limiteCredito?: number;
  formaPagoPreferida: FormaPago;
  contactoAlterno?: {
    nombre?: string;
    telefono?: string;
    email?: string;
  };
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
  creadoPor: string;
}

export interface HistorialCliente {
  clienteId: string;
  totalCompras: number;
  promedioFactura: number;
  ultimaCompra?: Date;
  comprasYTD: number;
  morosidad: number;
  facturasPendientes: number;
}

// ============================================
// INTERFACES - PRODUCTO
// ============================================

export interface Producto {
  id: string;
  codigo: string; // PRD-001
  nombre: string;
  sku: string;
  precio: number;
  costoUnitario: number;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo?: number;
  proveedorId?: string;
  descripcion?: string;
  imagenUrl?: string;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
  creadoPor: string;
}

export interface CalculosProducto {
  margenBruto: number; // %
  margenBrutoRD: number; // RD$
  stockDisponible: boolean;
  alertaStock: 'NORMAL' | 'BAJO' | 'CRITICO' | 'EXCESO';
}

// ============================================
// INTERFACES - DESCUENTO
// ============================================

export interface PoliticaDescuento {
  id: string;
  nombre: string;
  tipo: TipoDescuento;
  descripcion?: string;
  activo: boolean;
  // Para descuento por volumen
  cantidadMinima?: number;
  porcentaje?: number;
  // Para cliente especial
  clienteId?: string;
  montoFijo?: number;
  // Para promoción
  fechaInicio?: Date;
  fechaFin?: Date;
  productosAplicables?: string[]; // IDs de productos
  creadoEn: Date;
  creadoPor: string;
}

export interface DescuentoAplicado {
  id: string;
  politicaId?: string;
  tipo: TipoDescuento;
  porcentaje?: number;
  montoFijo?: number;
  justificacion?: string;
  aprobadoPor?: string;
  aprobadoEn?: Date;
}

// ============================================
// INTERFACES - COTIZACIÓN
// ============================================

export interface LineaCotizacion {
  id: string;
  productoId: string;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  descuento?: DescuentoAplicado;
  subtotal: number;
}

export interface Cotizacion {
  id: string;
  numero: string; // COT-2025-001
  version: number;
  cotizacionOriginalId?: string; // Si es una revisión
  fecha: Date;
  vigenciaHasta: Date;
  clienteId: string;
  cliente: Cliente;
  vendedorId: string;
  vendedor: Usuario;
  estado: EstadoCotizacion;
  lineas: LineaCotizacion[];
  subtotal: number;
  descuentoTotal: number;
  subtotalConDescuento: number;
  itbis: number;
  total: number;
  margenBruto: number;
  margenBrutoRD: number;
  margenNeto: number;
  notas?: string;
  facturaId?: string; // Si fue facturada
  creadoEn: Date;
  actualizadoEn: Date;
  creadoPor: string;
}

// ============================================
// INTERFACES - FACTURA
// ============================================

export interface LineaFactura {
  id: string;
  productoId: string;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  subtotal: number;
}

export interface Factura {
  id: string;
  ncf: string; // 01.01.0000000001
  numero: string; // Secuencial interno
  fecha: Date;
  cotizacionId: string;
  cotizacion: Cotizacion;
  clienteId: string;
  cliente: Cliente;
  vendedorId: string;
  vendedor: Usuario;
  regimenFiscal: RegimenFiscal;
  tipoNCF: TipoNCF;
  estado: EstadoFactura;
  lineas: LineaFactura[];
  subtotal: number;
  itbis: number;
  total: number;
  margenBruto: number;
  margenBrutoRD: number;
  formaPago: FormaPago;
  plazoCredito?: number; // días
  fechaVencimiento?: Date;
  montoPagado: number;
  montoPendiente: number;
  motivoAnulacion?: string;
  anuladoPor?: string;
  anuladoEn?: Date;
  creadoEn: Date;
  creadoPor: string;
}

// ============================================
// INTERFACES - PAGO/CXC
// ============================================

export interface DetalleRetencion {
  isr: number;
  itbis: number;
  anticipo: number;
  total: number;
}

export interface DetalleMedioPago {
  medio: MedioPago;
  monto: number;
  referencia?: string;
  // Para cheque
  banco?: string;
  numeroCheque?: string;
  fechaCheque?: Date;
  // Para transferencia
  bancoEmisor?: string;
  referenciaTransferencia?: string;
  // Para tarjeta
  bancoTarjeta?: string;
  ultimosDigitos?: string;
  tipo?: 'CREDITO' | 'DEBITO' | 'PREPAGO';
  // Para nota de crédito
  ncfNotaCredito?: string;
}

export interface Pago {
  id: string;
  numero: string; // RCP-2025-00001
  facturaId: string;
  factura: Factura;
  fecha: Date;
  montoPagado: number;
  retenciones: DetalleRetencion;
  netoRecibido: number;
  mediosPago: DetalleMedioPago[];
  referencia?: string;
  notas?: string;
  editadoEn?: Date;
  editadoPor?: string;
  motivoEdicion?: string;
  creadoEn: Date;
  creadoPor: string;
}

export interface PlanPago {
  id: string;
  facturaId: string;
  tipo: 'CONTADO' | 'CREDITO' | 'CUOTAS';
  numeroCuotas?: number;
  montoCuota?: number;
  cuotas?: Cuota[];
  creadoEn: Date;
}

export interface Cuota {
  numero: number;
  monto: number;
  fechaVencimiento: Date;
  montoPagado: number;
  estado: EstadoPago;
  diasMora?: number;
  interesMora?: number;
}

// ============================================
// INTERFACES - NOTAS CRÉDITO/DÉBITO
// ============================================

export enum TipoNota {
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
}

export enum MotivoNotaCredito {
  DEVOLUCION_PRODUCTO = 'DEVOLUCION_PRODUCTO',
  ERROR_FACTURACION = 'ERROR_FACTURACION',
  DESCUENTO_COMERCIAL = 'DESCUENTO_COMERCIAL',
  BONIFICACION = 'BONIFICACION',
  OTRO = 'OTRO',
}

export enum MotivoNotaDebito {
  SERVICIO_ADICIONAL = 'SERVICIO_ADICIONAL',
  AJUSTE_PRECIO = 'AJUSTE_PRECIO',
  INTERES_MORA = 'INTERES_MORA',
  CARGO_ADMINISTRATIVO = 'CARGO_ADMINISTRATIVO',
  OTRO = 'OTRO',
}

export interface LineaNota {
  id: string;
  productoId?: string;
  descripcion: string;
  cantidad: number;
  monto: number;
  subtotal: number;
}

export interface NotaCreditoDebito {
  id: string;
  ncf: string;
  tipo: TipoNota;
  numero: string;
  fecha: Date;
  facturaId: string;
  factura: Factura;
  clienteId: string;
  cliente: Cliente;
  motivo: MotivoNotaCredito | MotivoNotaDebito;
  descripcionMotivo: string;
  lineas: LineaNota[];
  subtotal: number;
  itbis: number;
  total: number;
  aplicada: boolean;
  aplicadaEn?: Date;
  impactoStock: boolean;
  aprobadoPor?: string;
  aprobadoEn?: Date;
  creadoEn: Date;
  creadoPor: string;
}

// ============================================
// INTERFACES - INVENTARIO
// ============================================

export interface MovimientoInventario {
  id: string;
  productoId: string;
  producto: Producto;
  tipo: TipoMovimientoInventario;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  stockAntes: number;
  stockDespues: number;
  referencia?: string; // Factura, NC, Orden Compra, etc.
  motivo?: string;
  proveedorId?: string;
  descripcion?: string;
  fecha: Date;
  creadoPor: string;
}

export interface EstadoInventario {
  productoId: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo?: number;
  valorTotal: number;
  alertaStock: 'NORMAL' | 'BAJO' | 'CRITICO' | 'EXCESO';
  rotacionDias: number;
  ultimoMovimiento?: Date;
}

// ============================================
// INTERFACES - USUARIO Y PERMISOS
// ============================================

export interface Permisos {
  modulo: string;
  crear: boolean;
  leer: boolean;
  editar: boolean;
  eliminar: boolean;
  aprobar?: boolean;
  exportar?: boolean;
}

export interface RestriccionesUsuario {
  descuentoMaximo: number; // %
  margenMinimo: number; // %
  limiteCreditoCliente: number; // RD$
  horasEdicionFactura: number;
}

export interface Usuario {
  id: string;
  nombreCompleto: string;
  cedula: string;
  email: string;
  nombreUsuario: string;
  passwordHash: string;
  rol: RolUsuario;
  permisos: Permisos[];
  restricciones: RestriccionesUsuario;
  activo: boolean;
  ultimoAcceso?: Date;
  creadoEn: Date;
  actualizadoEn: Date;
}

// ============================================
// INTERFACES - NCF
// ============================================

export interface ConfiguracionNCF {
  id: string;
  tipo: TipoNCF;
  nombre: string;
  codigoDGII: string; // A01, A04, etc.
  prefijo: string; // B01, B15, etc.
  cantidadAutorizada: number;
  rangoDesde: string;
  rangoHasta: string;
  fechaVencimiento: Date;
  usados: number;
  disponibles: number;
  habilitado: boolean;
  ultimoUsado?: string;
  creadoEn: Date;
  actualizadoEn: Date;
}

// ============================================
// INTERFACES - CONFIGURACIÓN
// ============================================

export interface ConfiguracionEmpresa {
  id: string;
  nombre: string;
  rnc: string;
  regimenFiscal: RegimenFiscal;
  direccion: string;
  telefono: string;
  email: string;
  logoUrl?: string;
  datosBancarios?: {
    banco: string;
    numeroCuenta: string;
    tipoCuenta: string;
  };
  actualizadoEn: Date;
  actualizadoPor: string;
}

export interface PoliticasNegocio {
  id: string;
  descuentoMaximoVendedor: number;
  descuentoSinAprobacion: number;
  descuentoRequiereGerente: number;
  descuentoRequiereAdmin: number;
  plazoCreditoDefault: number;
  limiteCreditoDefault: number;
  interesMora: number;
  numeroCuotasMax: number;
  cobranzaMinima: number;
  stockMinimoDefault: number;
  stockMaximoDefault: number;
  permitirVentaStockNegativo: boolean;
  metodoValorizacion: 'FIFO' | 'PROMEDIO';
  tasaITBIS: number;
  retencionISR: number;
  retencionITBIS: number;
  actualizadoEn: Date;
  actualizadoPor: string;
}

// ============================================
// INTERFACES - AUDITORÍA
// ============================================

export interface RegistroAuditoria {
  id: string;
  timestamp: Date;
  usuarioId: string;
  usuario: Usuario;
  modulo: string;
  accion: AccionAuditoria;
  entidadTipo: string; // Cliente, Producto, Factura, etc.
  entidadId: string;
  antes?: any;
  despues?: any;
  ip?: string;
  justificacion?: string;
  resultado: 'EXITO' | 'ERROR';
  nivelRiesgo: 'ALTO' | 'MEDIO' | 'BAJO' | 'INFO';
}

// ============================================
// INTERFACES - REPORTES
// ============================================

export interface Reporte607 {
  periodo: string;
  rncEmpresa: string;
  regimenFiscal: RegimenFiscal;
  fechaEmision: Date;
  lineas: {
    linea: number;
    rncCedula: string;
    tipoIngreso: number;
    ncf: string;
    fechaEmision: string;
    fechaRetencion?: string;
    montoFacturado: number;
    itbisFacturado: number;
    itbisRetenido: number;
    isrRetenido: number;
    formaPago: number;
  }[];
  totales: {
    montoTotal: number;
    itbisTotal: number;
    itbisRetenidoTotal: number;
    isrRetenidoTotal: number;
  };
}

export interface Reporte608 {
  periodo: string;
  rncEmpresa: string;
  lineas: {
    ncfAnulado: string;
    fechaAnulacion: string;
    motivo: string;
    ncfReferencia?: string;
  }[];
}

// ============================================
// INTERFACES - DASHBOARD
// ============================================

export interface KPIDashboard {
  ventasMesActual: number;
  ventasMesAnterior: number;
  crecimiento: number;
  meta: number;
  cumplimientoMeta: number;
  facturasHoy: number;
  ventasHoy: number;
  margenHoy: number;
  carteraTotal: number;
  carteraPagada: number;
  carteraPendiente: number;
  tasaCobranza: number;
  productosStockBajo: number;
  ncfDisponiblesCF: number;
  ncfDisponiblesGUB: number;
  ncfDisponiblesCONS: number;
}

// ============================================
// INTERFACES - API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  usuario: Usuario;
  expiresIn: number;
}

// ============================================
// VALIDACIONES
// ============================================

export const REGEX_RNC = /^\d{3}-\d{6}-\d{1}$/;
export const REGEX_CEDULA = /^\d{3}-\d{7}-\d{1}$/;
export const REGEX_NCF = /^\d{2}\.\d{2}\.\d{10}$/;
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ITBIS_RATE = 0.18;
export const SESSION_TIMEOUT_HOURS = 8;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_MINUTES = 15;
