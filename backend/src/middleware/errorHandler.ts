import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Error interno del servidor';
  let isOperational = false;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  }

  // Log del error
  logger.error('Error en request', {
    method: req.method,
    url: req.url,
    statusCode,
    message: error.message,
    stack: error.stack,
  });

  // Respuesta al cliente
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.url}`,
  });
};
