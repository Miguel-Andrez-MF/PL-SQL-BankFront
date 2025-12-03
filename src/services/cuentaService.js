import api from './api';

export const cuentaService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/cuentas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener cuentas' };
    }
  },

  getById: async (cuentaId) => {
    try {
      const response = await api.get(`/api/cuentas/${cuentaId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener cuenta' };
    }
  },

  getByCliente: async (clienteId) => {
    try {
      const response = await api.get(`/api/cuentas/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener cuentas del cliente' };
    }
  },

  activate: async (cuentaId) => {
    try {
      const response = await api.patch(`/api/cuentas/${cuentaId}/activar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al activar cuenta' };
    }
  },

  disable: async (cuentaId) => {
    try {
      const response = await api.patch(`/api/cuentas/${cuentaId}/deshabilitar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al deshabilitar cuenta' };
    }
  },

  block: async (cuentaId) => {
    try {
      const response = await api.patch(`/api/cuentas/${cuentaId}/bloquear`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al bloquear cuenta' };
    }
  }
};
