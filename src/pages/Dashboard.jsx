import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import Card from '../components/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getAccessibleViews = () => {
    const rol = user.rolId;
    const views = [];

    if (rol === 4) { // SuperAdmin
      views.push(
        { name: 'Clientes', path: '/clientes' },
        { name: 'Cuentas', path: '/cuentas' },
        { name: 'Transacciones', path: '/transacciones' },
        { name: 'Auditorías', path: '/auditorias' },
        { name: 'Perfil', path: '/perfil' }
      );
    } else if (rol === 1) { // Admin
      views.push(
        { name: 'Clientes', path: '/clientes' },
        { name: 'Cuentas', path: '/cuentas' },
        { name: 'Transacciones', path: '/transacciones' },
        { name: 'Auditorías', path: '/auditorias' },
        { name: 'Perfil', path: '/perfil' }
      );
    } else if (rol === 2) { // Analista
      views.push(
        { name: 'Cuentas', path: '/cuentas' },
        { name: 'Transacciones', path: '/transacciones' },
        { name: 'Perfil', path: '/perfil' }
      );
    } else if (rol === 3) { // Cliente
      views.push(
        { name: 'Transacciones', path: '/transacciones' },
        { name: 'Perfil', path: '/perfil' }
      );
    }

    return views;
  };

  const views = getAccessibleViews();

  return (
    <Layout title="Dashboard">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Bienvenido, {user.nombreUsuario}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Rol: {user.nombreRol}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {views.map((view) => (
            <Card key={view.path} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(view.path)}>
              <h3 className="text-lg font-semibold text-blue-600">{view.name}</h3>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
