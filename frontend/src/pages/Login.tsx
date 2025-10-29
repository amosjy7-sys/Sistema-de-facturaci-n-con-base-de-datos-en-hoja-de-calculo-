import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { authService } from '../services/auth';

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecuperar, setShowRecuperar] = useState(false);
  const [cedula, setCedula] = useState('');
  const [isRecuperando, setIsRecuperando] = useState(false);
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
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cedula) {
      toast.error('Por favor ingrese su cédula');
      return;
    }

    const cedulaRegex = /^\d{3}-\d{7}-\d{1}$/;
    if (!cedulaRegex.test(cedula)) {
      toast.error('Formato de cédula inválido (XXX-XXXXXXX-X)');
      return;
    }

    setIsRecuperando(true);

    try {
      const passwordTemporal = await authService.recuperarPassword(cedula);
      toast.success('Contraseña temporal generada');

      // Mostrar contraseña temporal en un modal/alert
      alert(`Su contraseña temporal es:\n\n${passwordTemporal}\n\nPor favor cámbiela después de iniciar sesión.`);

      setShowRecuperar(false);
      setCedula('');
    } catch (error: any) {
      toast.error('Error al recuperar contraseña. Verifique su cédula.');
    } finally {
      setIsRecuperando(false);
    }
  };

  if (showRecuperar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h1>
            <p className="text-gray-600">Ingrese su cédula para generar una contraseña temporal</p>
          </div>

          <form onSubmit={handleRecuperar} className="space-y-6">
            <div>
              <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-2">
                Cédula
              </label>
              <input
                id="cedula"
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="input"
                placeholder="XXX-XXXXXXX-X"
                disabled={isRecuperando}
                maxLength={13}
              />
              <p className="text-xs text-gray-500 mt-1">Formato: 000-0000000-0</p>
            </div>

            <button
              type="submit"
              disabled={isRecuperando}
              className="btn-primary w-full"
            >
              {isRecuperando ? 'Generando...' : 'Generar Contraseña Temporal'}
            </button>

            <button
              type="button"
              onClick={() => setShowRecuperar(false)}
              className="btn-secondary w-full"
            >
              Volver al Login
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Sistema conforme a normativas DGII</p>
            <p className="mt-1">© 2025 Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    );
  }

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
              autoComplete="username"
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
              autoComplete="current-password"
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
          <button
            onClick={() => setShowRecuperar(true)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            ¿Olvidó su contraseña?
          </button>
        </div>

        {/* Credenciales por defecto (solo en desarrollo) */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-1">Credenciales por defecto:</p>
            <p className="text-xs text-blue-700">Usuario: <strong>admin</strong></p>
            <p className="text-xs text-blue-700">Contraseña: <strong>Admin@2025</strong></p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Sistema conforme a normativas DGII</p>
          <p className="mt-1">© 2025 Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
