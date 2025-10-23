import { AccionAuditoria, RegistroAuditoria } from '../../../shared/types';
import { googleSheetsService } from './googleSheets';
import { logger } from '../utils/logger';

interface AuditoriaParams {
  usuarioId: string;
  modulo: string;
  accion: AccionAuditoria;
  entidadTipo: string;
  entidadId: string;
  antes?: any;
  despues?: any;
  ip?: string;
  justificacion?: string;
  resultado?: 'EXITO' | 'ERROR';
  nivelRiesgo?: 'ALTO' | 'MEDIO' | 'BAJO' | 'INFO';
}

class AuditoriaService {
  async registrar(params: AuditoriaParams): Promise<void> {
    try {
      const registro: RegistroAuditoria = {
        id: this.generarId(),
        timestamp: new Date(),
        usuarioId: params.usuarioId,
        usuario: {} as any, // Se llenará al leer
        modulo: params.modulo,
        accion: params.accion,
        entidadTipo: params.entidadTipo,
        entidadId: params.entidadId,
        antes: params.antes,
        despues: params.despues,
        ip: params.ip,
        justificacion: params.justificacion,
        resultado: params.resultado || 'EXITO',
        nivelRiesgo: params.nivelRiesgo || this.determinarNivelRiesgo(params.accion),
      };

      // Guardar en Google Sheets
      const valores = [
        [
          registro.id,
          registro.timestamp.toISOString(),
          registro.usuarioId,
          registro.modulo,
          registro.accion,
          registro.entidadTipo,
          registro.entidadId,
          JSON.stringify(registro.antes || {}),
          JSON.stringify(registro.despues || {}),
          registro.ip || '',
          registro.justificacion || '',
          registro.resultado,
          registro.nivelRiesgo,
        ],
      ];

      await googleSheetsService.escribir('AUDITORIA', valores);

      logger.info('Registro de auditoría creado', {
        id: registro.id,
        modulo: registro.modulo,
        accion: registro.accion,
      });
    } catch (error) {
      logger.error('Error registrando auditoría', error);
      // No lanzar error para no interrumpir la operación principal
    }
  }

  async obtenerRegistros(filtros?: {
    usuarioId?: string;
    modulo?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    nivelRiesgo?: string;
  }): Promise<RegistroAuditoria[]> {
    try {
      const datos = await googleSheetsService.leer('AUDITORIA');

      if (!datos || datos.length <= 1) {
        return [];
      }

      const registros: RegistroAuditoria[] = [];

      for (let i = 1; i < datos.length; i++) {
        const fila = datos[i];

        const registro: RegistroAuditoria = {
          id: fila[0],
          timestamp: new Date(fila[1]),
          usuarioId: fila[2],
          usuario: {} as any,
          modulo: fila[3],
          accion: fila[4] as AccionAuditoria,
          entidadTipo: fila[5],
          entidadId: fila[6],
          antes: fila[7] ? JSON.parse(fila[7]) : undefined,
          despues: fila[8] ? JSON.parse(fila[8]) : undefined,
          ip: fila[9],
          justificacion: fila[10],
          resultado: fila[11] as 'EXITO' | 'ERROR',
          nivelRiesgo: fila[12] as 'ALTO' | 'MEDIO' | 'BAJO' | 'INFO',
        };

        // Aplicar filtros
        if (filtros) {
          if (filtros.usuarioId && registro.usuarioId !== filtros.usuarioId) {
            continue;
          }

          if (filtros.modulo && registro.modulo !== filtros.modulo) {
            continue;
          }

          if (filtros.fechaDesde && registro.timestamp < filtros.fechaDesde) {
            continue;
          }

          if (filtros.fechaHasta && registro.timestamp > filtros.fechaHasta) {
            continue;
          }

          if (filtros.nivelRiesgo && registro.nivelRiesgo !== filtros.nivelRiesgo) {
            continue;
          }
        }

        registros.push(registro);
      }

      return registros;
    } catch (error) {
      logger.error('Error obteniendo registros de auditoría', error);
      throw error;
    }
  }

  async obtenerCambiosCriticos(dias: number = 7): Promise<RegistroAuditoria[]> {
    try {
      const fechaDesde = new Date();
      fechaDesde.setDate(fechaDesde.getDate() - dias);

      const registros = await this.obtenerRegistros({
        fechaDesde,
        nivelRiesgo: 'ALTO',
      });

      return registros;
    } catch (error) {
      logger.error('Error obteniendo cambios críticos', error);
      throw error;
    }
  }

  private determinarNivelRiesgo(accion: AccionAuditoria): 'ALTO' | 'MEDIO' | 'BAJO' | 'INFO' {
    const accionesAltoRiesgo: AccionAuditoria[] = [
      AccionAuditoria.ELIMINAR,
      AccionAuditoria.ANULAR,
    ];

    const accionesMedioRiesgo: AccionAuditoria[] = [
      AccionAuditoria.EDITAR,
      AccionAuditoria.APROBAR,
    ];

    const accionesBajoRiesgo: AccionAuditoria[] = [AccionAuditoria.CREAR];

    if (accionesAltoRiesgo.includes(accion)) {
      return 'ALTO';
    }

    if (accionesMedioRiesgo.includes(accion)) {
      return 'MEDIO';
    }

    if (accionesBajoRiesgo.includes(accion)) {
      return 'BAJO';
    }

    return 'INFO';
  }

  private generarId(): string {
    return `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

export const auditoriaService = new AuditoriaService();
