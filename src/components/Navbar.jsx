import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    const rol = user.rolId;
    const items = [
      { path: '/dashboard', label: 'Dashboard', icon: '🏠' }
    ];

    // Todas las vistas disponibles según rol
    if (rol === 4) { // SuperAdmin
      items.push(
        { path: '/clientes', label: 'Clientes', icon: '👥' },
        { path: '/cuentas', label: 'Cuentas', icon: '🏦' },
        { path: '/transacciones', label: 'Transacciones', icon: '💳' },
        { path: '/auditorias', label: 'Auditorías', icon: '📊' },
        { path: '/perfil', label: 'Perfil', icon: '👤' }
      );
    } else if (rol === 1) { // Admin
      items.push(
        { path: '/clientes', label: 'Clientes', icon: '👥' },
        { path: '/cuentas', label: 'Cuentas', icon: '🏦' },
        { path: '/transacciones', label: 'Transacciones', icon: '💳' },
        { path: '/auditorias', label: 'Auditorías', icon: '📊' },
        { path: '/perfil', label: 'Perfil', icon: '👤' }
      );
    } else if (rol === 2) { // Analista
      items.push(
        { path: '/cuentas', label: 'Cuentas', icon: '🏦' },
        { path: '/transacciones', label: 'Transacciones', icon: '💳' },
        { path: '/perfil', label: 'Perfil', icon: '👤' }
      );
    } else if (rol === 3) { // Cliente
      items.push(
        { path: '/transacciones', label: 'Transacciones', icon: '💳' },
        { path: '/perfil', label: 'Perfil', icon: '👤' }
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                🏦
              </div>
              <h1 className="text-xl font-bold text-gray-900">FrontBankDB</h1>
            </div>
          </div>

          {/* Navegación central */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Usuario y logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Hola,</span>
              <span className="text-sm font-medium text-gray-900">{user.nombreUsuario}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user.nombreRol}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
