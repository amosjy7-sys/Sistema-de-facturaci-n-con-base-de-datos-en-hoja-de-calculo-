# Guía de Instalación - Sistema de Facturación DGII

## Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Cuenta de Google Cloud (para Google Sheets API)
- Navegador web moderno

## Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Sistema-de-facturaci-n-con-base-de-datos-en-hoja-de-calculo-
```

## Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará las dependencias en el root, backend, frontend y shared.

## Paso 3: Configurar Google Sheets API

### 3.1 Crear Proyecto en Google Cloud

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto
3. Habilitar **Google Sheets API**
4. Ir a "APIs y servicios" > "Credenciales"
5. Crear credenciales OAuth 2.0:
   - Tipo de aplicación: Aplicación web
   - URI de redirección autorizada: `http://localhost:3001/auth/google/callback`
6. Descargar el archivo JSON de credenciales

### 3.2 Crear Google Spreadsheet

1. Ir a [Google Sheets](https://sheets.google.com/)
2. Crear una nueva hoja de cálculo
3. Copiar el ID de la hoja (está en la URL):
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 3.3 Guardar Credenciales

1. Colocar el archivo JSON descargado en `/backend/credentials.json`
2. El sistema generará automáticamente `/backend/token.json` al autorizar

## Paso 4: Configurar Variables de Entorno

### Backend (.env)

Crear archivo `/backend/.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=tu-clave-secreta-muy-segura-cambiar-en-produccion
JWT_EXPIRES_IN=8h

# Google Sheets API
GOOGLE_SHEETS_CLIENT_ID=tu-client-id-de-google
GOOGLE_SHEETS_CLIENT_SECRET=tu-client-secret-de-google
GOOGLE_SHEETS_REDIRECT_URI=http://localhost:3001/auth/google/callback
SPREADSHEET_ID=tu-spreadsheet-id

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Business Configuration
DEFAULT_ITBIS_RATE=0.18
DEFAULT_CREDIT_DAYS=30
DEFAULT_MIN_MARGIN=0.05
MAX_DISCOUNT_WITHOUT_APPROVAL=0.05
```

### Frontend (.env)

Crear archivo `/frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Sistema de Facturación DGII
VITE_APP_VERSION=1.0.0
```

## Paso 5: Iniciar la Aplicación

### Modo Desarrollo (Backend + Frontend)

```bash
npm run dev
```

Esto iniciará:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:5173`

### Iniciar Solo Backend

```bash
npm run dev:backend
```

### Iniciar Solo Frontend

```bash
npm run dev:frontend
```

## Paso 6: Primera Configuración

### 6.1 Autorizar Google Sheets

1. Al iniciar el backend por primera vez, ir a:
   ```
   http://localhost:3001/auth/google
   ```
2. Autorizar la aplicación
3. El sistema creará automáticamente el archivo `token.json`

### 6.2 Inicializar Hojas de Google Sheets

El sistema creará automáticamente las siguientes hojas:

- CLIENTES
- PRODUCTOS
- COTIZACIONES
- FACTURAS
- PAGOS
- NOTAS_CREDITO_DEBITO
- INVENTARIO
- USUARIOS
- NCF
- CONFIGURACION
- AUDITORIA
- DESCUENTOS

### 6.3 Usuario Administrador

**IMPORTANTE: Cambiar estas credenciales inmediatamente después del primer login**

```
Usuario: admin
Contraseña: Admin@2025
```

## Paso 7: Configuración Inicial del Sistema

### 7.1 Configurar Datos de la Empresa

1. Ir a **Configuración > Empresa**
2. Completar:
   - Nombre de la empresa
   - RNC
   - Régimen fiscal
   - Dirección
   - Teléfono
   - Correo electrónico
   - Logo (opcional)

### 7.2 Configurar NCF (Comprobantes Fiscales)

1. Ir a **Configuración > Comprobantes Fiscales**
2. Para cada tipo de NCF (Crédito Fiscal, Gubernamental, Consumidor Final):
   - Agregar prefijo (ej: B01)
   - Rango autorizado por DGII
   - Cantidad autorizada
   - Fecha de vencimiento

### 7.3 Crear Usuarios

1. Ir a **Configuración > Usuarios**
2. Crear usuarios con roles:
   - ADMIN
   - GERENTE
   - VENDEDOR
   - CONTADOR
   - ALMACENERO
   - COBRADOR

## Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev              # Backend + Frontend
npm run dev:backend      # Solo backend
npm run dev:frontend     # Solo frontend

# Producción
npm run build            # Build todo
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend
npm start                # Iniciar producción

# Linting
npm run lint

# Testing
npm test
```

## Verificación de Instalación

### Health Check del Backend

```bash
curl http://localhost:3001/health
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Sistema de Facturación DGII funcionando correctamente",
  "timestamp": "2025-01-XX...",
  "environment": "development"
}
```

### Frontend

Abrir en navegador: `http://localhost:5173`

Debería mostrar la pantalla de login.

## Solución de Problemas

### Error: "Cannot find module"

```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf shared/node_modules shared/package-lock.json

# Reinstalar
npm install
```

### Error: "Port already in use"

```bash
# Cambiar puerto en .env
# Backend: PORT=3002
# Frontend: vite --port 5174
```

### Error de Google Sheets: "Invalid credentials"

1. Verificar que `credentials.json` esté en `/backend/`
2. Borrar `token.json` y volver a autorizar
3. Verificar que el SPREADSHEET_ID sea correcto

### Error: "CORS"

Verificar que `FRONTEND_URL` en backend `.env` coincida con la URL del frontend.

## Producción

### Build

```bash
npm run build
```

### Variables de Entorno Producción

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=[clave-muy-segura-generada]
FRONTEND_URL=https://tu-dominio.com
```

### Nginx Reverse Proxy (Ejemplo)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5173;
    }

    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

## Soporte

Para problemas o dudas:

1. Revisar logs en `/backend/logs`
2. Verificar auditoría en el sistema
3. Consultar README.md

---

**Sistema de Facturación DGII - República Dominicana**
