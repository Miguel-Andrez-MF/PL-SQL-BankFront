import api from './api';

export const authService = {
  login: async (usuario, password) => {
    try {
      const response = await api.post('/api/auth/login', { usuario, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error en el login' };
    }
  }
};
