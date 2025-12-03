# PL-SQL-BankFront
Aplicación web frontend para el sistema bancario PL-SQL Bank, construida con React y TailwindCSS.
## Características
- **Autenticación**: Login con validación y almacenamiento en localStorage
- **Dashboard**: Panel principal con acceso basado en roles
- **Transacciones**: Gestión de transacciones con CRUD según permisos
- **Auditorías**: Vista de logs de auditoría
- **Perfil**: Información del usuario y cambio de contraseña
## Roles y Permisos
- **Admin (rol 1)**: Acceso completo a clientes, cuentas, transacciones y auditorías
- **Analista (rol 2)**: Acceso a cuentas y transacciones
- **Cliente (rol 3)**: Acceso solo a sus transacciones
- **SuperAdmin (rol 4)**: Acceso completo a todas las vistas, puede editar transacciones
## Tecnologías
- React 19
- React Router DOM
- TailwindCSS
- Axios para API calls
- Vite como bundler
## Instalación
1. Clona el repositorio
2. Instala dependencias: 
pm install
3. Ejecuta el servidor de desarrollo: 
pm run dev
## Estructura del Proyecto
`
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas principales
├── hooks/          # Hooks personalizados
├── utils/          # Utilidades
└── main.jsx        # Punto de entrada
`
## API Endpoints Esperados
- POST /api/auth/login
- GET /api/transacciones
- POST /api/transacciones
- PATCH /api/transacciones/{id}
- GET /api/auditorias
## Diseño
Paleta de colores:
- Primario: Azul (#3B82F6)
- Secundario: Verde (#10B981)
- Peligro: Rojo (#EF4444)
- Fondo: Gris claro (#F3F4F6)
- Texto: Gris oscuro (#1F2937)
