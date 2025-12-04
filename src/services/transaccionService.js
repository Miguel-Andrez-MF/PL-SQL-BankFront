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
      let endpoint;
      let payload;

      if (transaccion.tipoTransacId === 1) { // Depósito
        endpoint = '/api/transacciones/deposito';
        payload = {
          cuentaId: transaccion.cuentaId,
          monto: transaccion.monto
        };
      } else if (transaccion.tipoTransacId === 2) { // Retiro
        endpoint = '/api/transacciones/retiro';
        payload = {
          cuentaId: transaccion.cuentaId,
          monto: transaccion.monto
        };
      } else if (transaccion.tipoTransacId === 3) { // Transferencia
        endpoint = '/api/transacciones/transferencia';
        payload = {
          cuentaOrigen: transaccion.cuentaOrigen,
          cuentaDestino: transaccion.cuentaDestino,
          monto: transaccion.monto
        };
      } else {
        throw new Error('Tipo de transacción no válido');
      }

      const response = await api.post(endpoint, payload);
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
