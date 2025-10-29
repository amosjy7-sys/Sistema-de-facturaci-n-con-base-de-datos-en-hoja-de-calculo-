import { apiService } from './api';
import { Usuario } from '../../../shared/types';

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    usuario: Usuario;
    expiresIn: number;
  };
}

interface RecuperarPasswordResponse {
  success: boolean;
  message: string;
  data: {
    passwordTemporal: string;
  };
}

class AuthService {
  async login(nombreUsuario: string, password: string): Promise<{ token: string; usuario: Usuario }> {
    const response = await apiService.post<LoginResponse>('/auth/login', {
      nombreUsuario,
      password,
    });
    return response.data;
  }

  async verificarToken(): Promise<Usuario> {
    const response = await apiService.get<{ success: boolean; data: Usuario }>('/auth/verify');
    return response.data;
  }

  async recuperarPassword(cedula: string): Promise<string> {
    const response = await apiService.post<RecuperarPasswordResponse>('/auth/recuperar-password', {
      cedula
    });
    return response.data.passwordTemporal;
  }

  async cambiarPassword(passwordActual: string, passwordNuevo: string): Promise<void> {
    await apiService.post('/auth/cambiar-password', {
      passwordActual,
      passwordNuevo,
    });
  }

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
  }

  async obtenerPerfil(): Promise<Usuario> {
    const response = await apiService.get<{ success: boolean; data: Usuario }>('/auth/me');
    return response.data;
  }
}

export const authService = new AuthService();
