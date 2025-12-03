import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { transaccionService } from '../services/transaccionService';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

const Transacciones = () => {
  const { user } = useAuth();
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    cuentaId: '',
    tipoTransaccion: '',
    monto: ''
  });

  const headers = ['ID Transacción', 'Cuenta ID', 'Tipo de Transacción', 'Monto', 'Fecha'];

  useEffect(() => {
    fetchTransacciones();
  }, []);

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

  const handleCreate = async () => {
    try {
      if (user.rolId === 1) {
        setError('Los super-administradores no pueden realizar transacciones.');
        return;
      }
      await transaccionService.create({
        cuentaId: formData.cuentaId,
        monto: parseFloat(formData.monto),
        tipoTransacId: parseInt(formData.tipoTransaccion)
      });
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
      const updates = {};
      if (formData.monto) updates.monto = parseFloat(formData.monto);
      if (formData.tipoTransaccion) updates.tipoTransaccionId = parseInt(formData.tipoTransaccion);
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
      tipoTransaccion: '',
      monto: ''
    });
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      cuentaId: transaction.cuentaId,
      tipoTransaccion: transaction.tipoTransaccion,
      monto: transaction.monto
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

  const renderActions = (row) => {
    const rol = user.rolId;
    return (
      <div className="space-x-2">
        {rol === 1 && (
          <Button variant="secondary" onClick={() => openEditModal(row)} size="sm">
            Editar
          </Button>
        )}
        {(rol === 3 || rol === 4) && (
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Nueva Transacción
          </Button>
        )}
      </div>
    );
  };

  const formattedData = transacciones.map(t => ({
    'ID Transacción': t.transaccionId,
    'Cuenta ID': t.cuentaId,
    'Tipo de Transacción': getTipoTransaccionLabel(t.tipoTransacId),
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

        <div className="bg-white rounded-lg border border-gray-200">
          <Table headers={headers} data={formattedData} actions={renderActions} />
        </div>

        {/* Modal Crear */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nueva Transacción">
          <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
            <Input
              label="Cuenta ID"
              value={formData.cuentaId}
              onChange={(e) => setFormData({ ...formData, cuentaId: e.target.value })}
              placeholder="Ej: 1001"
              required
            />
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
            <Input
              label="Cuenta ID"
              value={formData.cuentaId}
              onChange={(e) => setFormData({ ...formData, cuentaId: e.target.value })}
              required
            />
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
