import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

class Logger {
  private logsDir: string;

  constructor() {
    this.logsDir = path.join(__dirname, '../../logs');
    this.ensureLogsDirectory();
  }

  private ensureLogsDirectory(): void {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private getLogFileName(): string {
    const fecha = new Date().toISOString().split('T')[0];
    return path.join(this.logsDir, `app-${fecha}.log`);
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}\n`;
  }

  private write(level: LogLevel, message: string, meta?: any): void {
    const formattedMessage = this.formatMessage(level, message, meta);

    // Escribir en consola
    console.log(formattedMessage.trim());

    // Escribir en archivo
    try {
      fs.appendFileSync(this.getLogFileName(), formattedMessage);
    } catch (error) {
      console.error('Error escribiendo log:', error);
    }
  }

  error(message: string, meta?: any): void {
    this.write(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.write(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: any): void {
    this.write(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.write(LogLevel.DEBUG, message, meta);
    }
  }
}

export const logger = new Logger();
