import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { logout, usuario } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: Package, label: 'Productos', path: '/productos' },
    { icon: FileText, label: 'Cotizaciones', path: '/cotizaciones' },
    { icon: Receipt, label: 'Facturas', path: '/facturas' },
    { icon: CreditCard, label: 'Cuentas por Cobrar', path: '/cuentas-por-cobrar' },
    { icon: BarChart3, label: 'Reportes', path: '/reportes' },
    { icon: Settings, label: 'Configuración', path: '/configuracion' },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 hidden lg:block">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">DGII Billing</h1>
      </div>

      {/* Usuario */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold">
              {usuario?.nombreCompleto?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {usuario?.nombreCompleto || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 truncate">{usuario?.rol || 'Rol'}</p>
          </div>
        </div>
      </div>

      {/* Menú */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
