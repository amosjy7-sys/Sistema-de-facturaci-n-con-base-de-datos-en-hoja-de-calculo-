import bcrypt from 'bcryptjs';
import { Usuario, RolUsuario, Permisos, RestriccionesUsuario } from '../../../shared/types';
import { memoryStorage } from './memoryStorage';
import { logger } from '../utils/logger';
import { validarEmail } from '../utils/validations';
import { AccionAuditoria } from '../../../shared/types';

class UsuarioService {
  private readonly SALT_ROUNDS = 12;

  /**
   * Crear usuario administrador por defecto si no existe
   */
  async inicializarUsuarioAdmin(): Promise<void> {
    try {
      await memoryStorage.inicializar();

      const usuarios = await this.obtenerTodos();

      const adminExiste = usuarios.some(u => u.rol === RolUsuario.ADMIN);

      if (!adminExiste) {
        logger.info('🔧 Creando usuario administrador por defecto...');

        const passwordHash = await bcrypt.hash('Admin@2025', this.SALT_ROUNDS);

        const admin: Usuario = {
          id: this.generarId(),
          nombreCompleto: 'Administrador',
          cedula: '000-0000000-0',
          email: 'admin@sistema.com',
          nombreUsuario: 'admin',
          passwordHash,
          rol: RolUsuario.ADMIN,
          permisos: this.obtenerPermisosCompletos(),
          restricciones: {
            descuentoMaximo: 100,
            margenMinimo: 0,
            limiteCreditoCliente: 999999999,
            horasEdicionFactura: 24,
          },
          activo: true,
          creadoEn: new Date(),
          actualizadoEn: new Date(),
        };

        await memoryStorage.guardarUsuario(admin);

        logger.info('✅ Usuario administrador creado exitosamente');
        logger.info('📋 Credenciales:');
        logger.info('   Usuario: admin');
        logger.info('   Contraseña: Admin@2025');
      } else {
        logger.info('✅ Usuario administrador ya existe');
      }
    } catch (error) {
      logger.error('❌ Error inicializando usuario admin', error);
    }
  }

  /**
   * Crear nuevo usuario
   */
  async crear(usuario: Omit<Usuario, 'id' | 'creadoEn' | 'actualizadoEn'>, creadoPor: string): Promise<Usuario> {
    try {
      // Validaciones
      if (!usuario.nombreCompleto || !usuario.nombreUsuario || !usuario.passwordHash) {
        throw new Error('Datos de usuario incompletos');
      }

      if (usuario.email && !validarEmail(usuario.email)) {
        throw new Error('Email inválido');
      }

      // Verificar si ya existe el usuario
      const existente = await this.buscarPorNombreUsuario(usuario.nombreUsuario);
      if (existente) {
        throw new Error('El nombre de usuario ya existe');
      }

      const nuevoUsuario: Usuario = {
        ...usuario,
        id: this.generarId(),
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      };

      // Guardar en memoria
      await memoryStorage.guardarUsuario(nuevoUsuario);

      logger.info(`Usuario creado: ${nuevoUsuario.nombreUsuario}`);

      return nuevoUsuario;
    } catch (error) {
      logger.error('Error creando usuario', error);
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios
   */
  async obtenerTodos(): Promise<Usuario[]> {
    try {
      return await memoryStorage.obtenerUsuarios();
    } catch (error) {
      logger.error('Error obteniendo usuarios', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por ID
   */
  async buscarPorId(id: string): Promise<Usuario | null> {
    try {
      return await memoryStorage.buscarPorId(id);
    } catch (error) {
      logger.error('Error buscando usuario por ID', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por nombre de usuario
   */
  async buscarPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
    try {
      return await memoryStorage.buscarPorNombreUsuario(nombreUsuario);
    } catch (error) {
      logger.error('Error buscando usuario por nombre', error);
      throw error;
    }
  }

  /**
   * Buscar usuario por cédula
   */
  async buscarPorCedula(cedula: string): Promise<Usuario | null> {
    try {
      return await memoryStorage.buscarPorCedula(cedula);
    } catch (error) {
      logger.error('Error buscando usuario por cédula', error);
      throw error;
    }
  }

  /**
   * Verificar contraseña
   */
  async verificarPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Error verificando password', error);
      return false;
    }
  }

  /**
   * Hash de contraseña
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Actualizar último acceso
   */
  async actualizarUltimoAcceso(usuarioId: string): Promise<void> {
    try {
      const usuario = await memoryStorage.buscarPorId(usuarioId);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      usuario.ultimoAcceso = new Date();
      await memoryStorage.actualizarUsuario(usuario);

      logger.info(`Último acceso actualizado para usuario: ${usuarioId}`);
    } catch (error) {
      logger.error('Error actualizando último acceso', error);
    }
  }

  /**
   * Cambiar contraseña
   */
  async cambiarPassword(usuarioId: string, passwordActual: string, passwordNuevo: string, cambiadoPor: string): Promise<void> {
    try {
      const usuario = await this.buscarPorId(usuarioId);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const passwordValido = await this.verificarPassword(passwordActual, usuario.passwordHash);
      if (!passwordValido) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Validar nueva contraseña (mínimo 8 caracteres)
      if (passwordNuevo.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      const nuevoHash = await this.hashPassword(passwordNuevo);

      // Actualizar en memoria
      usuario.passwordHash = nuevoHash;
      usuario.actualizadoEn = new Date();
      await memoryStorage.actualizarUsuario(usuario);

      logger.info(`Contraseña cambiada para usuario: ${usuarioId}`);
    } catch (error) {
      logger.error('Error cambiando contraseña', error);
      throw error;
    }
  }

  /**
   * Recuperar contraseña (generar temporal)
   */
  async recuperarPassword(cedula: string): Promise<string> {
    try {
      const usuario = await this.buscarPorCedula(cedula);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Generar contraseña temporal
      const passwordTemporal = this.generarPasswordTemporal();
      const nuevoHash = await this.hashPassword(passwordTemporal);

      // Actualizar en memoria
      usuario.passwordHash = nuevoHash;
      usuario.actualizadoEn = new Date();
      await memoryStorage.actualizarUsuario(usuario);

      logger.info(`Contraseña recuperada para usuario: ${usuario.nombreUsuario}`);

      return passwordTemporal;
    } catch (error) {
      logger.error('Error recuperando contraseña', error);
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  async actualizar(id: string, datos: Partial<Usuario>, actualizadoPor: string): Promise<Usuario> {
    try {
      const usuario = await this.buscarPorId(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      const usuarioActualizado: Usuario = {
        ...usuario,
        ...datos,
        id: usuario.id, // No permitir cambiar ID
        passwordHash: usuario.passwordHash, // No permitir cambiar password aquí
        actualizadoEn: new Date(),
      };

      await memoryStorage.actualizarUsuario(usuarioActualizado);

      logger.info(`Usuario actualizado: ${id}`);

      return usuarioActualizado;
    } catch (error) {
      logger.error('Error actualizando usuario', error);
      throw error;
    }
  }

  /**
   * Desactivar usuario (no eliminar)
   */
  async desactivar(id: string, desactivadoPor: string): Promise<void> {
    try {
      await this.actualizar(id, { activo: false }, desactivadoPor);
      logger.info(`Usuario desactivado: ${id}`);
    } catch (error) {
      logger.error('Error desactivando usuario', error);
      throw error;
    }
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  private generarId(): string {
    return `USR-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private generarPasswordTemporal(): string {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return password;
  }

  private obtenerPermisosCompletos(): Permisos[] {
    const modulos = [
      'Cliente',
      'Producto',
      'Descuento',
      'Cotizacion',
      'Factura',
      'Pago',
      'Nota',
      'Inventario',
      'Reporte',
      'Configuracion',
      'Usuario',
      'Auditoria',
    ];

    return modulos.map(modulo => ({
      modulo,
      crear: true,
      leer: true,
      editar: true,
      eliminar: true,
      aprobar: true,
      exportar: true,
    }));
  }

  private obtenerRestriccionesPorDefecto(): RestriccionesUsuario {
    return {
      descuentoMaximo: 5,
      margenMinimo: 5,
      limiteCreditoCliente: 50000,
      horasEdicionFactura: 24,
    };
  }
}

export const usuarioService = new UsuarioService();
