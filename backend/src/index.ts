import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config, isDevelopment } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFound } from './middleware/errorHandler';

// Importar rutas
import authRoutes from './routes/auth';
import { usuarioService } from './services/usuario';
// import clienteRoutes from './routes/cliente';
// import productoRoutes from './routes/producto';
// etc...

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Seguridad
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Compresión
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Logging
if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Demasiadas peticiones. Por favor intente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ============================================
// RUTAS
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema de Facturación DGII funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API Sistema de Facturación DGII',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clientes: '/api/clientes',
      productos: '/api/productos',
      descuentos: '/api/descuentos',
      cotizaciones: '/api/cotizaciones',
      facturas: '/api/facturas',
      pagos: '/api/pagos',
      notas: '/api/notas',
      inventario: '/api/inventario',
      reportes: '/api/reportes',
      configuracion: '/api/configuracion',
      usuarios: '/api/usuarios',
      auditoria: '/api/auditoria',
    },
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
// app.use('/api/clientes', clienteRoutes);
// app.use('/api/productos', productoRoutes);
// app.use('/api/descuentos', descuentoRoutes);
// app.use('/api/cotizaciones', cotizacionRoutes);
// app.use('/api/facturas', facturaRoutes);
// app.use('/api/pagos', pagoRoutes);
// app.use('/api/notas', notaRoutes);
// app.use('/api/inventario', inventarioRoutes);
// app.use('/api/reportes', reporteRoutes);
// app.use('/api/configuracion', configuracionRoutes);
// app.use('/api/usuarios', usuarioRoutes);
// app.use('/api/auditoria', auditoriaRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// 404 - Ruta no encontrada
app.use(notFound);

// Error handler global
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = config.port;

// Función para inicializar el sistema
async function inicializarSistema() {
  try {
    logger.info('🔧 Inicializando sistema...');

    // Inicializar usuario administrador por defecto
    await usuarioService.inicializarUsuarioAdmin();

    logger.info('✅ Sistema inicializado correctamente');
  } catch (error) {
    logger.error('❌ Error inicializando sistema:', error);
  }
}

app.listen(PORT, async () => {
  logger.info(`🚀 Servidor iniciado en puerto ${PORT}`);
  logger.info(`📊 Ambiente: ${config.nodeEnv}`);
  logger.info(`🌐 API disponible en: http://localhost:${PORT}/api`);
  logger.info(`💚 Health check: http://localhost:${PORT}/health`);

  if (isDevelopment) {
    logger.info(`🔧 Modo desarrollo activado`);
  }

  // Inicializar sistema
  await inicializarSistema();
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
