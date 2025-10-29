import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { verificarToken, generarToken, AuthRequest } from '../middleware/auth';
import { usuarioService } from '../services/usuario';
import { logger } from '../utils/logger';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter específico para login (más restrictivo)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: {
    success: false,
    error: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/auth/login
 * Login de usuario
 */
router.post(
  '/login',
  loginLimiter,
  validate([
    body('nombreUsuario').trim().notEmpty().withMessage('Nombre de usuario es requerido'),
    body('password').notEmpty().withMessage('Contraseña es requerida'),
  ]),
  async (req: Request, res: Response) => {
    try {
      const { nombreUsuario, password } = req.body;

      // Buscar usuario
      const usuario = await usuarioService.buscarPorNombreUsuario(nombreUsuario);

      if (!usuario) {
        logger.warn(`Intento de login fallido: usuario no encontrado - ${nombreUsuario}`);
        return res.status(401).json({
          success: false,
          error: 'Usuario o contraseña incorrectos',
        });
      }

      // Verificar si está activo
      if (!usuario.activo) {
        logger.warn(`Intento de login con usuario inactivo: ${nombreUsuario}`);
        return res.status(401).json({
          success: false,
          error: 'Usuario inactivo. Contacte al administrador.',
        });
      }

      // Verificar contraseña
      const passwordValido = await usuarioService.verificarPassword(password, usuario.passwordHash);

      if (!passwordValido) {
        logger.warn(`Intento de login fallido: contraseña incorrecta - ${nombreUsuario}`);
        return res.status(401).json({
          success: false,
          error: 'Usuario o contraseña incorrectos',
        });
      }

      // Actualizar último acceso
      await usuarioService.actualizarUltimoAcceso(usuario.id);

      // Generar token JWT
      const token = generarToken({
        id: usuario.id,
        nombreUsuario: usuario.nombreUsuario,
        rol: usuario.rol,
      });

      // Remover password del objeto de respuesta
      const { passwordHash, ...usuarioSinPassword } = usuario;

      logger.info(`Login exitoso: ${nombreUsuario}`);

      res.json({
        success: true,
        data: {
          token,
          usuario: usuarioSinPassword,
          expiresIn: 28800, // 8 horas en segundos
        },
      });
    } catch (error: any) {
      logger.error('Error en login', error);
      res.status(500).json({
        success: false,
        error: 'Error en el servidor',
      });
    }
  }
);

/**
 * GET /api/auth/verify
 * Verificar token y obtener usuario actual
 */
router.get('/verify', verificarToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    // Buscar usuario completo
    const usuario = await usuarioService.buscarPorId(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        error: 'Usuario inactivo',
      });
    }

    // Remover password
    const { passwordHash, ...usuarioSinPassword } = usuario;

    res.json({
      success: true,
      data: usuarioSinPassword,
    });
  } catch (error: any) {
    logger.error('Error verificando token', error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
    });
  }
});

/**
 * POST /api/auth/cambiar-password
 * Cambiar contraseña del usuario actual
 */
router.post(
  '/cambiar-password',
  verificarToken,
  validate([
    body('passwordActual').notEmpty().withMessage('Contraseña actual es requerida'),
    body('passwordNuevo')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado',
        });
      }

      const { passwordActual, passwordNuevo } = req.body;

      await usuarioService.cambiarPassword(
        req.usuario.id,
        passwordActual,
        passwordNuevo,
        req.usuario.id
      );

      logger.info(`Contraseña cambiada: ${req.usuario.nombreUsuario}`);

      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      });
    } catch (error: any) {
      logger.error('Error cambiando contraseña', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Error cambiando contraseña',
      });
    }
  }
);

/**
 * POST /api/auth/recuperar-password
 * Recuperar contraseña mediante cédula
 */
router.post(
  '/recuperar-password',
  loginLimiter,
  validate([
    body('cedula')
      .trim()
      .notEmpty()
      .withMessage('Cédula es requerida')
      .matches(/^\d{3}-\d{7}-\d{1}$/)
      .withMessage('Formato de cédula inválido (XXX-XXXXXXX-X)'),
  ]),
  async (req: Request, res: Response) => {
    try {
      const { cedula } = req.body;

      const passwordTemporal = await usuarioService.recuperarPassword(cedula);

      logger.info(`Contraseña recuperada para cédula: ${cedula}`);

      res.json({
        success: true,
        message: 'Contraseña temporal generada',
        data: {
          passwordTemporal,
          // En producción, esto se enviaría por email
          // Por ahora lo retornamos en la respuesta
        },
      });
    } catch (error: any) {
      logger.error('Error recuperando contraseña', error);

      // No revelar si el usuario existe o no (seguridad)
      res.status(400).json({
        success: false,
        error: 'Error procesando solicitud. Verifique la cédula ingresada.',
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout (cliente elimina token, aquí solo para auditoría)
 */
router.post('/logout', verificarToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    logger.info(`Logout: ${req.usuario.nombreUsuario}`);

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error: any) {
    logger.error('Error en logout', error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
    });
  }
});

/**
 * GET /api/auth/me
 * Obtener perfil del usuario actual
 */
router.get('/me', verificarToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const usuario = await usuarioService.buscarPorId(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    const { passwordHash, ...usuarioSinPassword } = usuario;

    res.json({
      success: true,
      data: usuarioSinPassword,
    });
  } catch (error: any) {
    logger.error('Error obteniendo perfil', error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
    });
  }
});

export default router;
