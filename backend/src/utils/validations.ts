/**
 * Validaciones DGII para República Dominicana
 */

/**
 * Valida formato de RNC (XXX-XXXXXX-X)
 * Utiliza algoritmo similar a Luhn para validación del dígito verificador
 */
export function validarRNC(rnc: string): boolean {
  // Formato: XXX-XXXXXX-X
  const regex = /^\d{3}-\d{6}-\d{1}$/;

  if (!regex.test(rnc)) {
    return false;
  }

  // Remover guiones para validación
  const rncLimpio = rnc.replace(/-/g, '');

  if (rncLimpio.length !== 10) {
    return false;
  }

  // Validar dígito verificador (algoritmo DGII)
  const digitosBase = rncLimpio.substring(0, 9);
  const digitoVerificador = parseInt(rncLimpio.charAt(9), 10);

  const suma = digitosBase
    .split('')
    .map((d, i) => {
      const digit = parseInt(d, 10);
      const peso = [1, 2, 1, 2, 1, 2, 1, 2, 1][i];
      const producto = digit * peso;
      return producto > 9 ? Math.floor(producto / 10) + (producto % 10) : producto;
    })
    .reduce((acc, val) => acc + val, 0);

  const digitoCalculado = (10 - (suma % 10)) % 10;

  return digitoCalculado === digitoVerificador;
}

/**
 * Valida formato de Cédula (XXX-XXXXXXX-X)
 * Utiliza algoritmo DGII para validación del dígito verificador
 */
export function validarCedula(cedula: string): boolean {
  // Formato: XXX-XXXXXXX-X
  const regex = /^\d{3}-\d{7}-\d{1}$/;

  if (!regex.test(cedula)) {
    return false;
  }

  // Remover guiones
  const cedulaLimpia = cedula.replace(/-/g, '');

  if (cedulaLimpia.length !== 11) {
    return false;
  }

  // Validar dígito verificador
  const digitosBase = cedulaLimpia.substring(0, 10);
  const digitoVerificador = parseInt(cedulaLimpia.charAt(10), 10);

  const pesos = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];

  const suma = digitosBase
    .split('')
    .map((d, i) => {
      const digit = parseInt(d, 10);
      const producto = digit * pesos[i];
      return producto > 9 ? Math.floor(producto / 10) + (producto % 10) : producto;
    })
    .reduce((acc, val) => acc + val, 0);

  const digitoCalculado = (10 - (suma % 10)) % 10;

  return digitoCalculado === digitoVerificador;
}

/**
 * Valida formato de NCF (XX.XX.XXXXXXXXXX)
 */
export function validarNCF(ncf: string): boolean {
  // Formato: XX.XX.XXXXXXXXXX (ej: 01.01.0000000001)
  const regex = /^\d{2}\.\d{2}\.\d{10}$/;
  return regex.test(ncf);
}

/**
 * Valida email
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Formatea RNC agregando guiones
 */
export function formatearRNC(rnc: string): string {
  const limpio = rnc.replace(/\D/g, '');
  if (limpio.length === 9) {
    return `${limpio.substring(0, 1)}-${limpio.substring(1, 8)}-${limpio.substring(8)}`;
  }
  if (limpio.length === 10) {
    return `${limpio.substring(0, 3)}-${limpio.substring(3, 9)}-${limpio.substring(9)}`;
  }
  return rnc;
}

/**
 * Formatea Cédula agregando guiones
 */
export function formatearCedula(cedula: string): string {
  const limpio = cedula.replace(/\D/g, '');
  if (limpio.length === 11) {
    return `${limpio.substring(0, 3)}-${limpio.substring(3, 10)}-${limpio.substring(10)}`;
  }
  return cedula;
}

/**
 * Formatea NCF agregando puntos
 */
export function formatearNCF(ncf: string): string {
  const limpio = ncf.replace(/\D/g, '');
  if (limpio.length === 14) {
    return `${limpio.substring(0, 2)}.${limpio.substring(2, 4)}.${limpio.substring(4)}`;
  }
  return ncf;
}

/**
 * Genera próximo número secuencial con formato
 */
export function generarProximoNumero(prefijo: string, ultimoNumero: number, longitud: number = 3): string {
  const siguiente = ultimoNumero + 1;
  const numeroFormateado = siguiente.toString().padStart(longitud, '0');
  return `${prefijo}-${numeroFormateado}`;
}

/**
 * Calcula ITBIS (18%)
 */
export function calcularITBIS(subtotal: number, tasa: number = 0.18): number {
  return Math.round(subtotal * tasa * 100) / 100;
}

/**
 * Calcula margen bruto
 */
export function calcularMargenBruto(precio: number, costo: number): number {
  if (precio === 0) return 0;
  return Math.round(((precio - costo) / precio) * 10000) / 100;
}

/**
 * Calcula margen bruto en RD$
 */
export function calcularMargenBrutoRD(precio: number, costo: number, cantidad: number = 1): number {
  return Math.round((precio - costo) * cantidad * 100) / 100;
}

/**
 * Valida correlatividad de NCF
 */
export function validarCorrelatividadNCF(ncfActual: string, ncfAnterior: string | null): boolean {
  if (!ncfAnterior) return true;

  const numeroActual = parseInt(ncfActual.split('.')[2], 10);
  const numeroAnterior = parseInt(ncfAnterior.split('.')[2], 10);

  return numeroActual === numeroAnterior + 1;
}

/**
 * Valida que un NCF esté en el rango autorizado
 */
export function validarRangoNCF(ncf: string, rangoDesde: string, rangoHasta: string): boolean {
  const numero = parseInt(ncf.split('.')[2], 10);
  const desde = parseInt(rangoDesde.split('.')[2], 10);
  const hasta = parseInt(rangoHasta.split('.')[2], 10);

  return numero >= desde && numero <= hasta;
}

/**
 * Extrae el número secuencial de un NCF
 */
export function extraerNumeroNCF(ncf: string): number {
  return parseInt(ncf.split('.')[2], 10);
}

/**
 * Genera NCF con formato
 */
export function generarNCF(prefijo: string, secuencia: number): string {
  const partes = prefijo.split('.');
  const tipoComprobante = partes[0]; // 01, 04, etc.
  const serie = partes[1]; // 01, 02, etc.
  const numeroFormateado = secuencia.toString().padStart(10, '0');

  return `${tipoComprobante}.${serie}.${numeroFormateado}`;
}

/**
 * Valida fecha en formato DGII (DD/MM/YYYY)
 */
export function validarFechaDGII(fecha: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(fecha)) return false;

  const [dia, mes, anio] = fecha.split('/').map(Number);
  const fechaObj = new Date(anio, mes - 1, dia);

  return (
    fechaObj.getDate() === dia &&
    fechaObj.getMonth() === mes - 1 &&
    fechaObj.getFullYear() === anio
  );
}

/**
 * Convierte Date a formato DGII (DD/MM/YYYY)
 */
export function formatearFechaDGII(fecha: Date): string {
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

/**
 * Convierte formato DGII a ISO 8601
 */
export function parsearFechaDGII(fecha: string): Date {
  const [dia, mes, anio] = fecha.split('/').map(Number);
  return new Date(anio, mes - 1, dia);
}

/**
 * Redondea a 2 decimales
 */
export function redondear(valor: number): number {
  return Math.round(valor * 100) / 100;
}

/**
 * Valida que un monto sea positivo
 */
export function validarMontoPositivo(monto: number): boolean {
  return monto > 0;
}

/**
 * Valida que los totales de una factura sean correctos
 */
export function validarTotalesFactura(
  subtotal: number,
  itbis: number,
  total: number,
  tasaITBIS: number = 0.18
): { valido: boolean; errores: string[] } {
  const errores: string[] = [];

  const itbisCalculado = calcularITBIS(subtotal, tasaITBIS);
  if (Math.abs(itbis - itbisCalculado) > 0.01) {
    errores.push(`ITBIS incorrecto. Esperado: ${itbisCalculado}, Recibido: ${itbis}`);
  }

  const totalCalculado = redondear(subtotal + itbis);
  if (Math.abs(total - totalCalculado) > 0.01) {
    errores.push(`Total incorrecto. Esperado: ${totalCalculado}, Recibido: ${total}`);
  }

  if (subtotal < 0) {
    errores.push('Subtotal no puede ser negativo');
  }

  if (itbis < 0) {
    errores.push('ITBIS no puede ser negativo');
  }

  if (total < 0) {
    errores.push('Total no puede ser negativo');
  }

  return {
    valido: errores.length === 0,
    errores,
  };
}

/**
 * Calcula días de mora
 */
export function calcularDiasMora(fechaVencimiento: Date): number {
  const hoy = new Date();
  const diferencia = hoy.getTime() - fechaVencimiento.getTime();
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  return dias > 0 ? dias : 0;
}

/**
 * Calcula interés de mora
 */
export function calcularInteresMora(
  montoPendiente: number,
  diasMora: number,
  tasaMensual: number = 0.02
): number {
  if (diasMora === 0) return 0;
  const tasaDiaria = tasaMensual / 30;
  return redondear(montoPendiente * tasaDiaria * diasMora);
}

/**
 * Determina estado de pago según fechas
 */
export function determinarEstadoPago(
  fechaVencimiento: Date,
  montoPendiente: number
): 'PAGADA' | 'PENDIENTE' | 'POR_VENCER' | 'VENCIDA' {
  if (montoPendiente === 0) return 'PAGADA';

  const hoy = new Date();
  const diasHastaVencimiento = Math.floor(
    (fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diasHastaVencimiento < 0) return 'VENCIDA';
  if (diasHastaVencimiento <= 5) return 'POR_VENCER';
  return 'PENDIENTE';
}

/**
 * Valida stock disponible
 */
export function validarStockDisponible(
  stockActual: number,
  cantidadSolicitada: number
): { disponible: boolean; mensaje?: string } {
  if (stockActual >= cantidadSolicitada) {
    return { disponible: true };
  }

  return {
    disponible: false,
    mensaje: `Stock insuficiente. Disponible: ${stockActual}, Solicitado: ${cantidadSolicitada}`,
  };
}

/**
 * Determina alerta de stock
 */
export function determinarAlertaStock(
  stockActual: number,
  stockMinimo: number,
  stockMaximo?: number
): 'NORMAL' | 'BAJO' | 'CRITICO' | 'EXCESO' {
  if (stockActual === 0) return 'CRITICO';
  if (stockActual <= stockMinimo) return 'BAJO';
  if (stockMaximo && stockActual > stockMaximo) return 'EXCESO';
  return 'NORMAL';
}
