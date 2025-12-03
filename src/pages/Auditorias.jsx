import React, { useState, useEffect } from 'react';
import { auditoriaService } from '../services/auditoriaService';
import Layout from '../components/Layout';
import Alert from '../components/Alert';

const Auditorias = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = ['ID Auditoría', 'ID Transacción', 'Usuario ID', 'Fecha de Operación', 'Monto Anterior', 'Monto Nuevo', 'Tipo Transacción Anterior', 'Tipo Transacción Nuevo', 'Operación'];

  useEffect(() => {
    fetchAuditorias();
  }, []);

  const fetchAuditorias = async () => {
    try {
      setLoading(true);
      const data = await auditoriaService.getAll();
      setAuditorias(data);
    } catch (error) {
      setError(error.message || 'Error al cargar auditorías');
    } finally {
      setLoading(false);
    }
  };

  const formatMonto = (monto) => {
    return monto ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(monto) : '-';
  };

  const getTipoTransaccionLabel = (tipo) => {
    const tipos = { 1: 'Depósito', 2: 'Retiro', 3: 'Transferencia' };
    return tipos[tipo] || tipo || '-';
  };

  const formattedData = auditorias.map(a => ({
    'ID Auditoría': a.auditoriaId,
    'ID Transacción': a.transaccionId,
    'Usuario ID': a.usuarioId,
    'Fecha de Operación': new Date(a.fechaOperacion).toLocaleDateString(),
    'Monto Anterior': formatMonto(a.montoAnterior),
    'Monto Nuevo': formatMonto(a.montoNuevo),
    'Tipo Transacción Anterior': getTipoTransaccionLabel(a.tipoTransaccionAnterior),
    'Tipo Transacción Nuevo': getTipoTransaccionLabel(a.tipoTransaccionNuevo),
    'Operación': a.operacion,
    operacion: a.operacion // para styling
  }));

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </Layout>
  );

  return (
    <Layout title="Auditorías">
      <div className="p-6">
        {error && <Alert message={error} type="error" onClose={() => setError('')} />}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formattedData.map((row, index) => (
                  <tr key={index} className={row.operacion === 'INSERT' ? 'bg-green-50' : row.operacion === 'UPDATE' ? 'bg-yellow-50' : ''}>
                    {headers.map((header, hIndex) => (
                      <td key={hIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auditorias;
