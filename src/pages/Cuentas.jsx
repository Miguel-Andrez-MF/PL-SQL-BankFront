import React, { useState, useEffect } from 'react';
import { cuentaService } from '../services/cuentaService';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import Alert from '../components/Alert';

const Cuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterCliente, setFilterCliente] = useState('');

  const headers = ['Cuenta ID', 'Cliente ID', 'Tipo de Cuenta', 'Estado', 'Fecha de Apertura', 'Saldo', 'Acciones'];

  useEffect(() => {
    fetchCuentas();
  }, []);

  const fetchCuentas = async () => {
    try {
      setLoading(true);
      const data = await cuentaService.getAll();
      setCuentas(data);
    } catch (error) {
      setError(error.message || 'Error al cargar cuentas');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (cuenta, action) => {
    try {
      let result;
      switch (action) {
        case 'activate':
          result = await cuentaService.activate(cuenta.cuentaId);
          break;
        case 'disable':
          result = await cuentaService.disable(cuenta.cuentaId);
          break;
        case 'block':
          result = await cuentaService.block(cuenta.cuentaId);
          break;
        default:
          return;
      }
      setSuccess(result.mensaje);
      fetchCuentas();
    } catch (error) {
      setError(error.error || error.message || 'Error al realizar la acción');
    }
  };

  const actions = (row) => (
    <div className="flex gap-2">
      {row.estadoId !== 2 && (
        <Button
          onClick={() => handleAction(row, 'activate')}
          className="bg-green-500 hover:bg-green-700 text-xs px-2 py-1"
        >
          Activar
        </Button>
      )}
      {row.estadoId !== 1 && (
        <Button
          onClick={() => handleAction(row, 'disable')}
          className="bg-yellow-500 hover:bg-yellow-700 text-xs px-2 py-1"
        >
          Deshabilitar
        </Button>
      )}
      {row.estadoId !== 3 && (
        <Button
          onClick={() => handleAction(row, 'block')}
          className="bg-red-500 hover:bg-red-700 text-xs px-2 py-1"
        >
          Bloquear
        </Button>
      )}
    </div>
  );

  const filteredCuentas = filterCliente
    ? cuentas.filter(cuenta => cuenta.clienteId === filterCliente)
    : cuentas;

  const filteredFormattedData = filteredCuentas.map(cuenta => ({
    'Cuenta ID': cuenta.cuentaId,
    'Cliente ID': cuenta.clienteId,
    'Tipo de Cuenta': cuenta.tipoCuentaDescripcion,
    'Estado': cuenta.estadoDescripcion,
    'Fecha de Apertura': new Date(cuenta.fechaApertura).toLocaleDateString(),
    'Saldo': `$${cuenta.saldo.toFixed(2)}`,
    ...cuenta
  }));

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestión de Cuentas</h1>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Filtrar por Cliente ID..."
            value={filterCliente}
            onChange={(e) => setFilterCliente(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <Table
          headers={headers}
          data={filteredFormattedData}
          actions={actions}
        />
      </div>
    </Layout>
  );
};

export default Cuentas;
