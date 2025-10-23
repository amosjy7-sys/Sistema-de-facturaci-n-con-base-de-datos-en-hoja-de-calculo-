import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreUsuario || !password) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      await login(nombreUsuario, password);
      toast.success('Bienvenido');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Facturación DGII</h1>
          <p className="text-gray-600">República Dominicana</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="input"
              placeholder="Ingrese su usuario"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-primary-600 hover:text-primary-700">
            ¿Olvidó su contraseña?
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Sistema conforme a normativas DGII</p>
          <p className="mt-1">© 2025 Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
