import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '../../../shared/types';
import { authService } from '../services/auth';

interface AuthContextType {
  usuario: Usuario | null;
  isLoading: boolean;
  login: (nombreUsuario: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar token y obtener usuario
      authService
        .verificarToken()
        .then((user) => {
          setUsuario(user);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (nombreUsuario: string, password: string) => {
    const { token, usuario: user } = await authService.login(nombreUsuario, password);
    localStorage.setItem('token', token);
    setUsuario(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const value = {
    usuario,
    isLoading,
    login,
    logout,
    isAuthenticated: !!usuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
