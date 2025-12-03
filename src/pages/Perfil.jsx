import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

const Perfil = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess('Contraseña cambiada exitosamente (simulado)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Layout title="Perfil de Usuario">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Usuario */}
          <Card title="Información del Usuario">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                <p className="mt-1 text-sm text-gray-900">{user.nombreUsuario}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cliente ID</label>
                <p className="mt-1 text-sm text-gray-900">{user.clienteId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <p className="mt-1 text-sm text-gray-900">{user.nombreRol}</p>
              </div>
            </div>
          </Card>

          {/* Cambiar Contraseña */}
          <Card title="Cambiar Contraseña">
            {error && <Alert message={error} type="error" onClose={() => setError('')} />}
            {success && <Alert message={success} type="success" onClose={() => setSuccess('')} />}

            <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} className="space-y-4">
              <Input
                label="Contraseña Actual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                required
              />

              <Input
                label="Nueva Contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                required
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                required
              />

              <Button variant="primary" type="submit">
                Cambiar Contraseña
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
