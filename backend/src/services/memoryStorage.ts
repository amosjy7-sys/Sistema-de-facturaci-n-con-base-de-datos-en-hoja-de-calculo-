import { Usuario, RolUsuario } from '../../../shared/types';
import { logger } from '../utils/logger';

/**
 * ALMACENAMIENTO TEMPORAL EN MEMORIA
 * Esto es temporal mientras se configura Google Sheets
 */
class MemoryStorage {
  private usuarios: Map<string, Usuario> = new Map();
  private initialized = false;

  async inicializar() {
    if (this.initialized) return;
    this.initialized = true;
    logger.info('💾 Usando almacenamiento en memoria (temporal)');
  }

  async guardarUsuario(usuario: Usuario): Promise<void> {
    this.usuarios.set(usuario.id, usuario);
    logger.info(`Usuario guardado en memoria: ${usuario.nombreUsuario}`);
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    return Array.from(this.usuarios.values());
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarios.get(id) || null;
  }

  async buscarPorNombreUsuario(nombreUsuario: string): Promise<Usuario | null> {
    const usuarios = Array.from(this.usuarios.values());
    return usuarios.find(u => u.nombreUsuario === nombreUsuario) || null;
  }

  async buscarPorCedula(cedula: string): Promise<Usuario | null> {
    const usuarios = Array.from(this.usuarios.values());
    return usuarios.find(u => u.cedula === cedula) || null;
  }

  async actualizarUsuario(usuario: Usuario): Promise<void> {
    this.usuarios.set(usuario.id, usuario);
    logger.info(`Usuario actualizado en memoria: ${usuario.nombreUsuario}`);
  }
}

export const memoryStorage = new MemoryStorage();
