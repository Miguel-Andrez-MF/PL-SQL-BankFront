import React, { useState, useEffect, useCallback } from 'react';
import { clienteService } from '../services/clienteService';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [deletingCliente, setDeletingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    identificacion: '',
    direccion: '',
    telefono: '',
    email: '',
    usuarioId: ''
  });

  const headers = ['Cliente ID', 'Nombre', 'Identificación', 'Dirección', 'Teléfono', 'Email', 'Total Cuentas', 'Saldo Total'];

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll(searchTerm);
      setClientes(data);
    } catch (error) {
      setError(error.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleCreate = async () => {
    try {
      await clienteService.create(formData);
      setSuccess('Cliente creado exitosamente');
      setShowCreateModal(false);
      resetForm();
      fetchClientes();
    } catch (error) {
      setError(error.error || error.message || 'Error al crear cliente');
    }
  };

  const handleEdit = async () => {
    try {
      await clienteService.update(editingCliente.clienteId, formData);
      setSuccess('Cliente actualizado exitosamente');
      setShowEditModal(false);
      resetForm();
      fetchClientes();
    } catch (error) {
      setError(error.error || error.message || 'Error al actualizar cliente');
    }
  };

  const handleDelete = async () => {
    try {
      await clienteService.delete(deletingCliente.clienteId);
      setSuccess('Cliente eliminado exitosamente');
      setShowDeleteModal(false);
      setDeletingCliente(null);
      fetchClientes();
    } catch (error) {
      setError(error.error || error.message || 'Error al eliminar cliente');
    }
  };

  const handleSearchById = async () => {
    const id = prompt('Ingrese el número de identificación:');
    if (id) {
      try {
        const cliente = await clienteService.searchByIdentification(id);
        alert(`Cliente encontrado: ${cliente.clienteId}`);
      } catch (error) {
        alert(error.message || 'Cliente no encontrado');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      identificacion: '',
      direccion: '',
      telefono: '',
      email: '',
      usuarioId: ''
    });
  };

  const openEditModal = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      identificacion: cliente.identificacion,
      direccion: cliente.direccion || '',
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      usuarioId: cliente.usuarioId || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (cliente) => {
    setDeletingCliente(cliente);
    setShowDeleteModal(true);
  };

  const formattedData = clientes.map(cliente => ({
    'Cliente ID': cliente.clienteId,
    'Nombre': cliente.nombre,
    'Identificación': cliente.identificacion,
    'Dirección': cliente.direccion || '',
    'Teléfono': cliente.telefono || '',
    'Email': cliente.email || '',
    'Total Cuentas': cliente.totalCuentas || 0,
    'Saldo Total': cliente.saldoTotal ? `$${cliente.saldoTotal.toFixed(2)}` : '$0.00',
    ...cliente
  }));

  const actions = (row) => [
    <Button
      key="edit"
      onClick={() => openEditModal(row)}
      className="bg-blue-500 hover:bg-blue-700 mr-2"
    >
      Editar
    </Button>,
    <Button
      key="delete"
      onClick={() => openDeleteModal(row)}
      className="bg-red-500 hover:bg-red-700"
    >
      Eliminar
    </Button>
  ];

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
          <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          <div className="flex gap-4">
            <Button
              onClick={handleSearchById}
              className="bg-green-500 hover:bg-green-700"
            >
              Buscar por ID
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 hover:bg-blue-700"
            >
              Crear Cliente
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <Table
          headers={headers}
          data={formattedData}
          actions={actions}
        />

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear Cliente"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
            <div className="space-y-4">
              <Input
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <Input
                label="Identificación"
                value={formData.identificacion}
                onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                required
              />
              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Usuario ID (opcional)"
                value={formData.usuarioId}
                onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" onClick={() => setShowCreateModal(false)} variant="secondary">
                  Cancelar
                </Button>
                <Button type="submit">Crear</Button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Editar Cliente"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
            <div className="space-y-4">
              <Input
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <Input
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" onClick={() => setShowEditModal(false)} variant="secondary">
                  Cancelar
                </Button>
                <Button type="submit">Actualizar</Button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminación"
        >
          <p>¿Está seguro de que desea eliminar al cliente "{deletingCliente?.nombre}"?</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button type="button" onClick={() => setShowDeleteModal(false)} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-700">
              Eliminar
            </Button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Clientes;
