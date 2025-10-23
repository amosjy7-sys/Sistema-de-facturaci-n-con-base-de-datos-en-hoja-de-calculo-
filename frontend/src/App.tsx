import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages (se crearán después)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Cotizaciones from './pages/Cotizaciones';
import Facturas from './pages/Facturas';
import CuentasPorCobrar from './pages/CuentasPorCobrar';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="productos" element={<Productos />} />
          <Route path="cotizaciones" element={<Cotizaciones />} />
          <Route path="facturas" element={<Facturas />} />
          <Route path="cuentas-por-cobrar" element={<CuentasPorCobrar />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
