import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [notificaciones] = useState(3);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Breadcrumb/Title - se puede personalizar por página */}
      <div className="flex-1 hidden lg:block">
        {/* Vacío por ahora, se puede agregar breadcrumb aquí */}
      </div>

      {/* Notificaciones */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-6 h-6 text-gray-600" />
          {notificaciones > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
