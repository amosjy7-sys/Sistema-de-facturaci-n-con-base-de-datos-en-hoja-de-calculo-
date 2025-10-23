import { apiService } from './api';
import { Usuario, AuthResponse } from '../../../shared/types';

class AuthService {
  async login(nombreUsuario: string, password: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', {
      nombreUsuario,
      password,
    });
    return response;
  }

  async verificarToken(): Promise<Usuario> {
    const response = await apiService.get<{ success: boolean; data: Usuario }>('/auth/verify');
    return response.data;
  }

  async recuperarPassword(cedula: string): Promise<void> {
    await apiService.post('/auth/recuperar-password', { cedula });
  }

  async cambiarPassword(passwordActual: string, passwordNuevo: string): Promise<void> {
    await apiService.post('/auth/cambiar-password', {
      passwordActual,
      passwordNuevo,
    });
  }
}

export const authService = new AuthService();
