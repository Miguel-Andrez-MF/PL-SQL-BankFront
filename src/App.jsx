import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transacciones from './pages/Transacciones';
import Auditorias from './pages/Auditorias';
import Perfil from './pages/Perfil';
import Clientes from './pages/Clientes';
import Cuentas from './pages/Cuentas';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transacciones"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
                <Transacciones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auditorias"
            element={
              <ProtectedRoute allowedRoles={[1, 4]}>
                <Auditorias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute allowedRoles={[1, 4]}>
                <Clientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cuentas"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 4]}>
                <Cuentas />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
