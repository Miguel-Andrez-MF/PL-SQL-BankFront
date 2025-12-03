// Mock data for development
export const mockUsers = [
  {
    usuarioId: 1,
    clienteId: 1,
    nombreUsuario: 'admin',
    rolId: 1,
    nombreRol: 'SuperAdmin'
  },
  {
    usuarioId: 2,
    clienteId: 2,
    nombreUsuario: 'manager',
    rolId: 2,
    nombreRol: 'Admin'
  },
  {
    usuarioId: 3,
    clienteId: 3,
    nombreUsuario: 'analyst',
    rolId: 3,
    nombreRol: 'Analista'
  },
  {
    usuarioId: 4,
    clienteId: 4,
    nombreUsuario: 'cliente',
    rolId: 4,
    nombreRol: 'Cliente'
  }
];

export const mockTransacciones = [
  {
    id: 1,
    cuentaId: 1001,
    tipoTransaccion: 1, // Depósito
    monto: 500.00,
    fecha: '2024-12-02T10:30:00Z',
    usuarioId: 1
  },
  {
    id: 2,
    cuentaId: 1002,
    tipoTransaccion: 2, // Retiro
    monto: 200.00,
    fecha: '2024-12-01T14:15:00Z',
    usuarioId: 2
  },
  {
    id: 3,
    cuentaId: 1001,
    tipoTransaccion: 3, // Transferencia
    monto: 1500.00,
    fecha: '2024-11-30T09:45:00Z',
    usuarioId: 3
  },
  {
    id: 4,
    cuentaId: 1003,
    tipoTransaccion: 1, // Depósito
    monto: 750.00,
    fecha: '2024-11-29T16:20:00Z',
    usuarioId: 4
  },
  {
    id: 5,
    cuentaId: 1002,
    tipoTransaccion: 2, // Retiro
    monto: 300.00,
    fecha: '2024-11-28T11:10:00Z',
    usuarioId: 1
  }
];

export const mockAuditorias = [
  {
    id: 1,
    transaccionId: 1,
    usuarioId: 1,
    fechaOperacion: '2024-12-02T10:30:00Z',
    montoAnterior: null,
    montoNuevo: 500.00,
    tipoTransaccionAnterior: null,
    tipoTransaccionNuevo: 1,
    operacion: 'INSERT'
  },
  {
    id: 2,
    transaccionId: 2,
    usuarioId: 2,
    fechaOperacion: '2024-12-01T14:15:00Z',
    montoAnterior: null,
    montoNuevo: 200.00,
    tipoTransaccionAnterior: null,
    tipoTransaccionNuevo: 2,
    operacion: 'INSERT'
  },
  {
    id: 3,
    transaccionId: 3,
    usuarioId: 3,
    fechaOperacion: '2024-11-30T09:45:00Z',
    montoAnterior: null,
    montoNuevo: 1500.00,
    tipoTransaccionAnterior: null,
    tipoTransaccionNuevo: 3,
    operacion: 'INSERT'
  },
  {
    id: 4,
    transaccionId: 1,
    usuarioId: 1,
    fechaOperacion: '2024-12-02T11:00:00Z',
    montoAnterior: 500.00,
    montoNuevo: 600.00,
    tipoTransaccionAnterior: 1,
    tipoTransaccionNuevo: 1,
    operacion: 'UPDATE'
  },
  {
    id: 5,
    transaccionId: 4,
    usuarioId: 4,
    fechaOperacion: '2024-11-29T16:20:00Z',
    montoAnterior: null,
    montoNuevo: 750.00,
    tipoTransaccionAnterior: null,
    tipoTransaccionNuevo: 1,
    operacion: 'INSERT'
  }
];
