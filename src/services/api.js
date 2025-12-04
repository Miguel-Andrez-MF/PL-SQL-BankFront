import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar X-User-ID automáticamente donde sea necesario
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // No agregar X-User-ID para GET /api/clientes
  if (user.usuarioId && !(config.method === 'get' && config.url?.includes('/api/clientes'))) {
    config.headers['X-User-ID'] = user.usuarioId;
  }
  return config;
});

export default api;
