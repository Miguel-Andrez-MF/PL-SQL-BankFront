import api from './api';

export const transaccionService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/transacciones');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener transacciones' };
    }
  },

  create: async (transaccion) => {
    try {
      const response = await api.post('/api/transacciones', transaccion);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear transacción' };
    }
  },

  update: async (id, updates) => {
    try {
      const response = await api.patch(`/api/transacciones/${id}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar transacción' };
    }
  }
};
