import api from './api';

export const auditoriaService = {
  getAll: async () => {
    try {
      const response = await api.get('/api/auditorias');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener auditorías' };
    }
  }
};
