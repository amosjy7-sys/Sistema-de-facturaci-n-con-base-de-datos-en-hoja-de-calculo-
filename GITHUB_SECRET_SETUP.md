# Configuración de GitHub Secret para Auto-Deploy

## 🔐 CLASP_AUTH Secret

Para que el auto-deploy a Google Apps Script funcione, necesitas crear un secret en GitHub.

---

## 📋 PASOS PARA CONFIGURAR

### 1. Ve a GitHub Secrets

Abre esta URL en tu navegador:
```
https://github.com/amosjy7-sys/Sistema-de-facturaci-n-con-base-de-datos-en-hoja-de-calculo-/settings/secrets/actions
```

### 2. Crea un Nuevo Secret

1. Click en **"New repository secret"**
2. En **Name**, escribe: `CLASP_AUTH`
3. En **Secret**, pega el siguiente JSON:

```json
{
  "token": {
    "type": "authorized_user",
    "client_id": "407408718192.apps.googleusercontent.com",
    "client_secret": "client_secret_stuff",
    "refresh_token": "refresh_token_here"
  },
  "oauth2ClientSettings": {
    "clientId": "407408718192.apps.googleusercontent.com",
    "clientSecret": "client_secret_stuff",
    "redirectUri": "http://localhost"
  },
  "isLocalCreds": false
}
```

4. Click en **"Add secret"**

---

## ✅ VERIFICACIÓN

Una vez creado el secret, verás:
- **CLASP_AUTH** en la lista de secrets
- Status: ✓ Updated X seconds ago

---

## 🚀 SIGUIENTE PASO

Cuando hagas **merge a main**, el workflow se ejecutará automáticamente:

1. GitHub Actions detectará el push a `main`
2. Instalará `clasp`
3. Usará el secret `CLASP_AUTH` para autenticarse
4. Deployará el código a Google Apps Script
5. Script ID: `1E805LRmVhQeWJMsyeh8e0QH6jpz8gplQfPsi493Ol2GaMXg4jrOyic6m`

---

## 🔍 MONITOREAR EL DEPLOYMENT

Puedes ver el estado en:
```
https://github.com/amosjy7-sys/Sistema-de-facturaci-n-con-base-de-datos-en-hoja-de-calculo-/actions
```

---

## ⚠️ IMPORTANTE

**Reemplaza los valores del JSON con los reales:**
- `client_secret_stuff` → Tu client secret real
- `refresh_token_here` → Tu refresh token real

Si no tienes estos valores, ejecuta en tu máquina local:
```bash
npm install -g @google/clasp
clasp login
cat ~/.clasprc.json
```

Y copia el contenido completo.

---

## 📝 NOTA

Este secret es sensible y privado. GitHub lo encriptará y no será visible después de crearlo.

---

✅ Una vez configurado, el auto-deploy estará completamente funcional.
