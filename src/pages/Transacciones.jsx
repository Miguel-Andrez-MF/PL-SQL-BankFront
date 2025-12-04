import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { transaccionService } from '../services/transaccionService';
import { cuentaService } from '../services/cuentaService';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

const Transacciones = () => {
  const { user } = useAuth();
  const [transacciones, setTransacciones] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [cuentaUsuario, setCuentaUsuario] = useState(null);
  const [formData, setFormData] = useState({
    cuentaId: '',
    cuentaOrigen: '',
    cuentaDestino: '',
    tipoTransaccion: '',
    monto: ''
  });
  const [filters, setFilters] = useState({
    cuentaId: '',
    tipoTransacId: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const headers = ['ID Transacción', 'Cuenta ID', 'Tipo de Transacción', 'Monto', 'Fecha'];

  const fetchCuentaUsuario = useCallback(async () => {
    if (user && user.rolId === 3 && user.clienteId) {
      try {
        const data = await cuentaService.getByCliente(user.clienteId);
        if (data && data.length > 0) {
          setCuentaUsuario(data[0]); // Asumir primera cuenta
          setFilters(prev => ({ ...prev, cuentaId: data[0].cuentaId })); // Filtrar por su cuenta
        }
      } catch (error) {
        setError(error.message || 'Error al cargar cuenta del usuario');
      }
    }
  }, [user]);

  useEffect(() => {
    fetchTransacciones();
    fetchCuentas();
    fetchCuentaUsuario();
  }, [user, fetchCuentaUsuario]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const fetchTransacciones = async () => {
    try {
      setLoading(true);
      const data = await transaccionService.getAll();
      setTransacciones(data);
    } catch (error) {
      setError(error.message || 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchCuentas = async () => {
    try {
      const data = await cuentaService.getAll();
      // Ordenar alfabéticamente por cuentaId
      const sortedData = data.sort((a, b) => a.cuentaId.localeCompare(b.cuentaId));
      setCuentas(sortedData);
    } catch (error) {
      setError(error.message || 'Error al cargar cuentas');
    }
  };

  const handleCreate = async () => {
    try {
      if (user.rolId === 4) {
        setError('Los super-administradores no pueden realizar transacciones.');
        return;
      }

      let transaccionData;

      if (parseInt(formData.tipoTransaccion) === 3) { // Transferencia
        if (user.rolId === 3 && cuentaUsuario) {
          // Cliente: origen es su cuenta
          transaccionData = {
            cuentaOrigen: cuentaUsuario.cuentaId,
            cuentaDestino: formData.cuentaDestino,
            monto: parseFloat(formData.monto),
            tipoTransacId: parseInt(formData.tipoTransaccion)
          };
        } else {
          transaccionData = {
            cuentaOrigen: formData.cuentaOrigen,
            cuentaDestino: formData.cuentaDestino,
            monto: parseFloat(formData.monto),
            tipoTransacId: parseInt(formData.tipoTransaccion)
          };
        }
      } else { // Depósito o Retiro
        if (user.rolId === 3 && cuentaUsuario) {
          // Cliente: usar su cuenta
          transaccionData = {
            cuentaId: cuentaUsuario.cuentaId,
            monto: parseFloat(formData.monto),
            tipoTransacId: parseInt(formData.tipoTransaccion)
          };
        } else {
          transaccionData = {
            cuentaId: formData.cuentaId,
            monto: parseFloat(formData.monto),
            tipoTransacId: parseInt(formData.tipoTransaccion)
          };
        }
      }

      await transaccionService.create(transaccionData);
      setSuccess('Transacción creada exitosamente');
      setShowCreateModal(false);
      resetForm();
      fetchTransacciones();
    } catch (error) {
      setError(error.error || error.message || 'Error al crear transacción');
    }
  };

  const handleEdit = async () => {
    try {
      const updates = {
        monto: parseFloat(formData.monto),
        tipoTransaccionId: parseInt(formData.tipoTransaccion)
      };

      await transaccionService.update(editingTransaction.transaccionId, updates);
      setSuccess('Transacción actualizada exitosamente');
      setShowEditModal(false);
      setEditingTransaction(null);
      resetForm();
      fetchTransacciones();
    } catch (error) {
      setError(error.error || error.message || 'Error al actualizar transacción');
    }
  };

  const resetForm = () => {
    setFormData({
      cuentaId: '',
      cuentaOrigen: '',
      cuentaDestino: '',
      tipoTransaccion: '',
      monto: ''
    });
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      tipoTransaccion: transaction.tipoTransacId.toString(),
      monto: transaction.monto.toString()
    });
    setShowEditModal(true);
  };

  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(monto);
  };

  const getTipoTransaccionLabel = (tipo) => {
    const tipos = { 1: 'Depósito', 2: 'Retiro', 3: 'Transferencia' };
    return tipos[tipo] || tipo;
  };

  const renderTipoBadge = (tipo) => {
    const label = getTipoTransaccionLabel(tipo);
    let bgColor = 'bg-gray-100 text-gray-800';
    if (tipo === 1) bgColor = 'bg-green-100 text-green-800';
    else if (tipo === 2) bgColor = 'bg-red-100 text-red-800';
    else if (tipo === 3) bgColor = 'bg-blue-100 text-blue-800';
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>{label}</span>;
  };

  const filteredTransacciones = transacciones.filter((t) => {
    const matchesCuenta = !filters.cuentaId || t.cuentaId === filters.cuentaId;
    const matchesTipo = !filters.tipoTransacId || t.tipoTransacId.toString() === filters.tipoTransacId;
    const fechaTransac = new Date(t.fechaTransac);
    const matchesDesde = !filters.fechaDesde || fechaTransac >= new Date(filters.fechaDesde);
    const matchesHasta = !filters.fechaHasta || fechaTransac <= new Date(filters.fechaHasta);
    return matchesCuenta && matchesTipo && matchesDesde && matchesHasta;
  });

  const paginatedTransacciones = filteredTransacciones.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredTransacciones.length / pageSize);

  const renderActions = (row) => {
    const rol = user.rolId;
    return (
      <div className="space-x-2">
        {rol === 4 && (
          <Button variant="secondary" onClick={() => openEditModal(row)} size="sm">
            Editar
          </Button>
        )}
      </div>
    );
  };

  const formattedData = paginatedTransacciones.map(t => ({
    'ID Transacción': t.transaccionId,
    'Cuenta ID': t.cuentaId,
    'Tipo de Transacción': renderTipoBadge(t.tipoTransacId),
    'Monto': formatMonto(t.monto),
    'Fecha': new Date(t.fechaTransac).toLocaleDateString(),
    ...t
  }));

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </Layout>
  );

  return (
    <Layout title="Transacciones">
      <div className="p-6">
        {error && <Alert message={error} type="error" onClose={() => setError('')} />}
        {success && <Alert message={success} type="success" onClose={() => setSuccess('')} />}

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta</label>
              {user.rolId === 3 && cuentaUsuario ? (
                <input
                  type="text"
                  value={cuentaUsuario.cuentaId}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-100"
                />
              ) : (
                <select
                  value={filters.cuentaId}
                  onChange={(e) => setFilters({ ...filters, cuentaId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las cuentas</option>
                  {cuentas.map((cuenta) => (
                    <option key={cuenta.cuentaId} value={cuenta.cuentaId}>
                      {cuenta.cuentaId}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transacción</label>
              <select
                value={filters.tipoTransacId}
                onChange={(e) => setFilters({ ...filters, tipoTransacId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="1">Depósito</option>
                <option value="2">Retiro</option>
                <option value="3">Transferencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
              <input
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => setFilters({ ...filters, fechaDesde: e.target.value })}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
              <input
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => setFilters({ ...filters, fechaHasta: e.target.value })}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Botón Nueva Transacción */}
        {(user.rolId === 1 || user.rolId === 2 || user.rolId === 3) && (
          <div className="mb-4">
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Nueva Transacción
            </Button>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200">
          <Table headers={headers} data={formattedData} actions={renderActions} />
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="secondary"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Modal Crear */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nueva Transacción">
          <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transacción</label>
              <select
                value={formData.tipoTransaccion}
                onChange={(e) => {
                  setFormData({ ...formData, tipoTransaccion: e.target.value, cuentaId: '', cuentaOrigen: '', cuentaDestino: '' });
                }}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="1">Depósito</option>
                <option value="2">Retiro</option>
                <option value="3">Transferencia</option>
              </select>
            </div>

            {formData.tipoTransaccion && parseInt(formData.tipoTransaccion) === 3 ? (
              // Transferencia
              <>
                {user.rolId === 3 && cuentaUsuario ? (
                  // Cliente: origen fijo
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta Origen</label>
                    <input
                      type="text"
                      value={cuentaUsuario.cuentaId}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-100"
                    />
                  </div>
                ) : (
                  // Otros roles: select origen
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta Origen</label>
                    <select
                      value={formData.cuentaOrigen}
                      onChange={(e) => setFormData({ ...formData, cuentaOrigen: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar cuenta origen</option>
                      {cuentas.map((cuenta) => (
                        <option key={cuenta.cuentaId} value={cuenta.cuentaId}>
                          {cuenta.cuentaId}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta Destino</label>
                  <select
                    value={formData.cuentaDestino}
                    onChange={(e) => setFormData({ ...formData, cuentaDestino: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar cuenta destino</option>
                    {cuentas.filter(c => c.cuentaId !== (user.rolId === 3 && cuentaUsuario ? cuentaUsuario.cuentaId : formData.cuentaOrigen)).map((cuenta) => (
                      <option key={cuenta.cuentaId} value={cuenta.cuentaId}>
                        {cuenta.cuentaId}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : formData.tipoTransaccion && (parseInt(formData.tipoTransaccion) === 1 || parseInt(formData.tipoTransaccion) === 2) ? (
              // Depósito o Retiro
              user.rolId === 3 && cuentaUsuario ? (
                // Cliente: cuenta fija
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta</label>
                  <input
                    type="text"
                    value={cuentaUsuario.cuentaId}
                    readOnly
                    className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-100"
                  />
                </div>
              ) : (
                // Otros roles: select cuenta
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta</label>
                  <select
                    value={formData.cuentaId}
                    onChange={(e) => setFormData({ ...formData, cuentaId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar cuenta</option>
                    {cuentas.map((cuenta) => (
                      <option key={cuenta.cuentaId} value={cuenta.cuentaId}>
                        {cuenta.cuentaId}
                      </option>
                    ))}
                  </select>
                </div>
              )
            ) : null}

            <Input
              label="Monto (€)"
              type="number"
              step="0.01"
              min="0"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              placeholder="0.00"
              required
            />
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Crear Transacción
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal Editar */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Transacción">
          <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transacción</label>
              <select
                value={formData.tipoTransaccion}
                onChange={(e) => setFormData({ ...formData, tipoTransaccion: e.target.value })}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="1">Depósito</option>
                <option value="2">Retiro</option>
                <option value="3">Transferencia</option>
              </select>
            </div>
            <Input
              label="Monto (€)"
              type="number"
              step="0.01"
              min="0"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              placeholder="0.00"
              required
            />
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Transacciones;
