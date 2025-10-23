import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';
import { RolUsuario } from '../../../shared/types';

export interface AuthRequest extends Request {
  usuario?: {
    id: string;
    nombreUsuario: string;
    rol: RolUsuario;
  };
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado',
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwtSecret) as any;

    req.usuario = {
      id: decoded.id,
      nombreUsuario: decoded.nombreUsuario,
      rol: decoded.rol,
    };

    next();
  } catch (error: any) {
    logger.error('Error verificando token', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Token inválido',
    });
  }
};

export const verificarRol = (...rolesPermitidos: RolUsuario[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      logger.warn('Acceso denegado', {
        usuario: req.usuario.nombreUsuario,
        rol: req.usuario.rol,
        rolesPermitidos,
      });

      return res.status(403).json({
        success: false,
        error: 'No tiene permisos para realizar esta acción',
      });
    }

    next();
  };
};

export const generarToken = (payload: any): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const verificarPermisos = (modulo: string, accion: 'crear' | 'leer' | 'editar' | 'eliminar') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // TODO: Implementar verificación de permisos específicos
    // Por ahora, permitir todo si está autenticado
    next();
  };
};
