import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { logger } from '../utils/logger';

class GoogleSheetsService {
  private oauth2Client: OAuth2Client;
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = config.googleSheets.spreadsheetId;

    this.oauth2Client = new google.auth.OAuth2(
      config.googleSheets.clientId,
      config.googleSheets.clientSecret,
      config.googleSheets.redirectUri
    );

    this.sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });

    this.loadCredentials();
  }

  private loadCredentials(): void {
    const tokenPath = path.join(__dirname, '../../token.json');

    try {
      if (fs.existsSync(tokenPath)) {
        const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
        this.oauth2Client.setCredentials(token);
        logger.info('Credenciales de Google Sheets cargadas');
      } else {
        logger.warn('No se encontraron credenciales de Google Sheets');
      }
    } catch (error) {
      logger.error('Error cargando credenciales de Google Sheets', error);
    }
  }

  private saveCredentials(tokens: any): void {
    const tokenPath = path.join(__dirname, '../../token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));
    logger.info('Credenciales de Google Sheets guardadas');
  }

  async authorize(code: string): Promise<void> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      this.saveCredentials(tokens);
      logger.info('Autorización de Google Sheets completada');
    } catch (error) {
      logger.error('Error en autorización de Google Sheets', error);
      throw error;
    }
  }

  getAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  async inicializarHojas(): Promise<void> {
    try {
      logger.info('Inicializando hojas de Google Sheets...');

      const hojas = [
        {
          properties: {
            title: 'CLIENTES',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'PRODUCTOS',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'COTIZACIONES',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'FACTURAS',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'PAGOS',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'NOTAS_CREDITO_DEBITO',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'INVENTARIO',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'USUARIOS',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'NCF',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'CONFIGURACION',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'AUDITORIA',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'DESCUENTOS',
            gridProperties: { frozenRowCount: 1 },
          },
        },
      ];

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: hojas.map((hoja) => ({
            addSheet: hoja,
          })),
        },
      });

      logger.info('Hojas creadas exitosamente');

      // Crear encabezados
      await this.crearEncabezados();
    } catch (error: any) {
      if (error.message && error.message.includes('already exists')) {
        logger.info('Las hojas ya existen');
      } else {
        logger.error('Error inicializando hojas', error);
        throw error;
      }
    }
  }

  private async crearEncabezados(): Promise<void> {
    const encabezados: { [key: string]: string[] } = {
      CLIENTES: [
        'ID',
        'Código',
        'Nombre',
        'Tipo Documento',
        'Documento',
        'Tipo NCF',
        'Teléfono',
        'Dirección',
        'Email',
        'Límite Crédito',
        'Forma Pago Preferida',
        'Contacto Alterno',
        'Activo',
        'Creado En',
        'Actualizado En',
        'Creado Por',
      ],
      PRODUCTOS: [
        'ID',
        'Código',
        'Nombre',
        'SKU',
        'Precio',
        'Costo Unitario',
        'Categoría',
        'Stock Actual',
        'Stock Mínimo',
        'Stock Máximo',
        'Proveedor ID',
        'Descripción',
        'Imagen URL',
        'Activo',
        'Creado En',
        'Actualizado En',
        'Creado Por',
      ],
      COTIZACIONES: [
        'ID',
        'Número',
        'Versión',
        'Cotización Original ID',
        'Fecha',
        'Vigencia Hasta',
        'Cliente ID',
        'Vendedor ID',
        'Estado',
        'Líneas (JSON)',
        'Subtotal',
        'Descuento Total',
        'Subtotal Con Descuento',
        'ITBIS',
        'Total',
        'Margen Bruto %',
        'Margen Bruto RD$',
        'Margen Neto %',
        'Notas',
        'Factura ID',
        'Creado En',
        'Actualizado En',
        'Creado Por',
      ],
      FACTURAS: [
        'ID',
        'NCF',
        'Número',
        'Fecha',
        'Cotización ID',
        'Cliente ID',
        'Vendedor ID',
        'Régimen Fiscal',
        'Tipo NCF',
        'Estado',
        'Líneas (JSON)',
        'Subtotal',
        'ITBIS',
        'Total',
        'Margen Bruto %',
        'Margen Bruto RD$',
        'Forma Pago',
        'Plazo Crédito',
        'Fecha Vencimiento',
        'Monto Pagado',
        'Monto Pendiente',
        'Motivo Anulación',
        'Anulado Por',
        'Anulado En',
        'Creado En',
        'Creado Por',
      ],
      PAGOS: [
        'ID',
        'Número',
        'Factura ID',
        'Fecha',
        'Monto Pagado',
        'Retenciones (JSON)',
        'Neto Recibido',
        'Medios Pago (JSON)',
        'Referencia',
        'Notas',
        'Editado En',
        'Editado Por',
        'Motivo Edición',
        'Creado En',
        'Creado Por',
      ],
      NOTAS_CREDITO_DEBITO: [
        'ID',
        'NCF',
        'Tipo',
        'Número',
        'Fecha',
        'Factura ID',
        'Cliente ID',
        'Motivo',
        'Descripción Motivo',
        'Líneas (JSON)',
        'Subtotal',
        'ITBIS',
        'Total',
        'Aplicada',
        'Aplicada En',
        'Impacto Stock',
        'Aprobado Por',
        'Aprobado En',
        'Creado En',
        'Creado Por',
      ],
      INVENTARIO: [
        'ID',
        'Producto ID',
        'Tipo Movimiento',
        'Cantidad',
        'Costo Unitario',
        'Costo Total',
        'Stock Antes',
        'Stock Después',
        'Referencia',
        'Motivo',
        'Proveedor ID',
        'Descripción',
        'Fecha',
        'Creado Por',
      ],
      USUARIOS: [
        'ID',
        'Nombre Completo',
        'Cédula',
        'Email',
        'Nombre Usuario',
        'Password Hash',
        'Rol',
        'Permisos (JSON)',
        'Restricciones (JSON)',
        'Activo',
        'Último Acceso',
        'Creado En',
        'Actualizado En',
      ],
      NCF: [
        'ID',
        'Tipo',
        'Nombre',
        'Código DGII',
        'Prefijo',
        'Cantidad Autorizada',
        'Rango Desde',
        'Rango Hasta',
        'Fecha Vencimiento',
        'Usados',
        'Disponibles',
        'Habilitado',
        'Último Usado',
        'Creado En',
        'Actualizado En',
      ],
      CONFIGURACION: [
        'Clave',
        'Valor (JSON)',
        'Descripción',
        'Actualizado En',
        'Actualizado Por',
      ],
      AUDITORIA: [
        'ID',
        'Timestamp',
        'Usuario ID',
        'Módulo',
        'Acción',
        'Entidad Tipo',
        'Entidad ID',
        'Antes (JSON)',
        'Después (JSON)',
        'IP',
        'Justificación',
        'Resultado',
        'Nivel Riesgo',
      ],
      DESCUENTOS: [
        'ID',
        'Nombre',
        'Tipo',
        'Descripción',
        'Activo',
        'Cantidad Mínima',
        'Porcentaje',
        'Cliente ID',
        'Monto Fijo',
        'Fecha Inicio',
        'Fecha Fin',
        'Productos Aplicables (JSON)',
        'Creado En',
        'Creado Por',
      ],
    };

    for (const [hoja, headers] of Object.entries(encabezados)) {
      try {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${hoja}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });

        logger.info(`Encabezados creados para hoja: ${hoja}`);
      } catch (error) {
        logger.error(`Error creando encabezados para ${hoja}`, error);
      }
    }
  }

  async leer(hoja: string, rango?: string): Promise<any[]> {
    try {
      const range = rango || `${hoja}!A:Z`;
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });

      return response.data.values || [];
    } catch (error) {
      logger.error(`Error leyendo hoja ${hoja}`, error);
      throw error;
    }
  }

  async escribir(hoja: string, valores: any[][], rango?: string): Promise<void> {
    try {
      const range = rango || `${hoja}!A:Z`;
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: valores,
        },
      });

      logger.info(`Datos escritos en hoja: ${hoja}`);
    } catch (error) {
      logger.error(`Error escribiendo en hoja ${hoja}`, error);
      throw error;
    }
  }

  async actualizar(hoja: string, valores: any[][], rango: string): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${hoja}!${rango}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: valores,
        },
      });

      logger.info(`Datos actualizados en hoja: ${hoja}, rango: ${rango}`);
    } catch (error) {
      logger.error(`Error actualizando hoja ${hoja}`, error);
      throw error;
    }
  }

  async eliminar(hoja: string, fila: number): Promise<void> {
    try {
      // Obtener ID de la hoja
      const sheetMetadata = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheet = sheetMetadata.data.sheets.find(
        (s: any) => s.properties.title === hoja
      );

      if (!sheet) {
        throw new Error(`Hoja ${hoja} no encontrada`);
      }

      const sheetId = sheet.properties.sheetId;

      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId,
                  dimension: 'ROWS',
                  startIndex: fila - 1,
                  endIndex: fila,
                },
              },
            },
          ],
        },
      });

      logger.info(`Fila ${fila} eliminada de hoja: ${hoja}`);
    } catch (error) {
      logger.error(`Error eliminando fila de ${hoja}`, error);
      throw error;
    }
  }

  async buscar(hoja: string, columna: string, valor: string): Promise<number | null> {
    try {
      const datos = await this.leer(hoja);

      if (!datos || datos.length === 0) {
        return null;
      }

      const headers = datos[0];
      const columnIndex = headers.indexOf(columna);

      if (columnIndex === -1) {
        return null;
      }

      for (let i = 1; i < datos.length; i++) {
        if (datos[i][columnIndex] === valor) {
          return i + 1; // Fila en Google Sheets (1-indexed)
        }
      }

      return null;
    } catch (error) {
      logger.error(`Error buscando en hoja ${hoja}`, error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
