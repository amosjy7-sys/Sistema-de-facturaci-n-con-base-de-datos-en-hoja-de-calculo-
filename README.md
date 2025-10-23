# 🇩🇴 Sistema de Facturación DGII - República Dominicana

Sistema integral de facturación y ventas conforme a normativas DGII (Dirección General de Impuestos Internos) de República Dominicana.

## Características Principales

### 10 Módulos Completos

1. **Cliente** - Gestión completa de clientes con validaciones RNC/Cédula DGII
2. **Productos** - Catálogo de productos con control de stock y márgenes
3. **Descuentos** - Sistema de políticas de descuentos con aprobaciones
4. **Cotización** - Flujo completo con versionado y seguimiento
5. **Facturación** - Emisión de NCF conforme DGII con correlatividad estricta
6. **Cuentas por Cobrar** - Gestión de pagos, planes de crédito y morosidad
7. **Notas Crédito/Débito** - Ajustes y devoluciones DGII-compliant
8. **Inventario** - Control de stock con trazabilidad completa
9. **Reportes** - Reportes 607, 608 y análisis de negocio
10. **Auditoría & Configuración** - Sistema completo de auditoría y configuración

## Stack Tecnológico

### Frontend
- React 18+
- TailwindCSS 3
- Vite
- Recharts 2 (gráficos)
- Lucide React (iconos)

### Backend
- Node.js 18+
- Express
- Google Sheets API v4
- JWT Authentication
- bcrypt

### Base de Datos
- Google Sheets (sincronización bidireccional)

## Estructura del Proyecto

```
.
├── backend/           # API Node.js/Express
│   ├── src/
│   │   ├── controllers/   # Controladores de rutas
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Definición de rutas
│   │   ├── middleware/    # Middleware (auth, validación, etc.)
│   │   ├── services/      # Lógica de negocio
│   │   ├── config/        # Configuración
│   │   └── utils/         # Utilidades
│   └── package.json
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Servicios API
│   │   ├── contexts/      # Context providers
│   │   └── utils/         # Utilidades
│   └── package.json
├── shared/            # Código compartido
│   └── types/         # TypeScript types
└── package.json       # Root package.json (workspaces)
```

## Instalación

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Cuenta Google Cloud (para Google Sheets API)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd Sistema-de-facturaci-n-con-base-de-datos-en-hoja-de-calculo-
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en `/backend`:
```env
# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=8h

# Google Sheets API
GOOGLE_SHEETS_CLIENT_ID=your-client-id
GOOGLE_SHEETS_CLIENT_SECRET=your-client-secret
GOOGLE_SHEETS_REDIRECT_URI=http://localhost:3001/auth/google/callback
SPREADSHEET_ID=your-spreadsheet-id

# CORS
FRONTEND_URL=http://localhost:5173
```

Crear archivo `.env` en `/frontend`:
```env
VITE_API_URL=http://localhost:3001/api
```

4. **Configurar Google Sheets API**
- Ir a [Google Cloud Console](https://console.cloud.google.com/)
- Crear un nuevo proyecto
- Habilitar Google Sheets API
- Crear credenciales OAuth 2.0
- Descargar credenciales y guardar en `/backend/credentials.json`

5. **Iniciar aplicación**
```bash
# Desarrollo (frontend + backend)
npm run dev

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend
```

## Configuración Inicial

### 1. Primera Ejecución
Al iniciar por primera vez, el sistema creará automáticamente las hojas necesarias en Google Sheets:
- CLIENTES
- PRODUCTOS
- COTIZACIONES
- FACTURAS
- PAGOS
- USUARIOS
- CONFIGURACION
- AUDITORIA
- NCF
- INVENTARIO

### 2. Usuario Administrador
Credenciales por defecto (cambiar inmediatamente):
- Usuario: `admin`
- Contraseña: `Admin@2025`

### 3. Configuración Empresa
1. Ir a **Configuración > Empresa**
2. Completar datos:
   - Nombre empresa
   - RNC
   - Régimen fiscal
   - Dirección, teléfono, correo
   - Logo

### 4. Configurar NCF
1. Ir a **Configuración > Comprobantes Fiscales**
2. Agregar rangos autorizados por DGII para cada tipo:
   - Crédito Fiscal
   - Gubernamental
   - Consumidor Final
   - Nota de Crédito
   - Nota de Débito

## Características DGII

### Validaciones Implementadas
- ✅ RNC: Formato XXX-XXXXXX-X
- ✅ Cédula: Formato XXX-XXXXXXX-X
- ✅ NCF: Correlatividad estricta sin saltos
- ✅ ITBIS: Exactamente 18%
- ✅ Fechas: ISO 8601 interno, DD/MM/YYYY export
- ✅ Reportes 607/608: Formato oficial DGII

### Reportes Fiscales
- **Reporte 607** - Ventas (exportable CSV/Excel formato DGII)
- **Reporte 608** - Anulaciones
- **Reporte Fiscal Integral** - Para contador

## Flujo de Negocio

```
CLIENTE → COTIZACIÓN → FACTURA → CXC → PAGO
   ↓                                ↓
PRODUCTO + STOCK ────────→ INVENTARIO
   ↓                                ↓
DESCUENTOS ──────────────→ MARGEN REAL
   ↓
VALIDACIÓN DGII ─────────→ CUMPLIMIENTO
   ↓
REPORTES 607/608 ────────→ TRAZABILIDAD
```

## Seguridad

- **Autenticación**: Google OAuth 2.0 + JWT
- **Contraseñas**: bcrypt (workFactor: 12)
- **Sesiones**: JWT con expiración 8 horas
- **HTTPS**: Requerido en producción
- **Rate Limiting**: 5 intentos fallidos = lock 15 min
- **Auditoría**: Log completo de operaciones

## Backups

- **Automáticos**: Diarios a Google Drive
- **Manuales**: Exportar JSON/CSV/Excel
- **Retención**: 30 días
- **Encriptación**: AES-256 (opcional)

## Responsive Design

- **Desktop** (≥1024px): Sidebar + contenido completo
- **Tablet** (768px-1023px): Sidebar colapsable
- **Mobile** (<768px): Fullscreen, modo tarjetas

## Soporte

Para problemas o dudas:
1. Revisar documentación
2. Verificar logs en `/backend/logs`
3. Consultar auditoría en Configuración > Auditoría

## Licencia

Copyright © 2025 - Sistema de Facturación DGII

---

**Desarrollado con ❤️ para cumplimiento fiscal en República Dominicana**
