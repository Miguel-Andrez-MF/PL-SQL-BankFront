import api from './api';

export const clienteService = {
  getAll: async (filtroNombre = '') => {
    try {
      const response = await api.get('/api/clientes', {
        params: filtroNombre ? { filtroNombre } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Error al obtener clientes' };
    }
  },

  create: async (cliente) => {
    try {
      const response = await api.post('/api/clientes', cliente);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear cliente' };
    }
  },

  update: async (clienteId, updates) => {
    try {
      const response = await api.put(`/api/clientes/${clienteId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar cliente' };
    }
  },

  delete: async (clienteId) => {
    try {
      const response = await api.delete(`/api/clientes/${clienteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar cliente' };
    }
  },

  searchByIdentification: async (identificacion) => {
    try {
      const response = await api.get(`/api/clientes/buscar/${identificacion}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Cliente no encontrado' };
    }
  }
};
