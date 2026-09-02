# gestion_gastos_2025216

# Instalación del proyecto

## Requisitos previos

- **Node.js** (v20 o superior) — [descargar aquí](https://nodejs.org/)
- **pnpm** — Node ya trae `corepack`, que instala pnpm sin necesitar `npm`:
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```
  Verifica que quedó instalado:
  ```bash
  pnpm --version
  ```

---

## Backend

### 1. Entrar a la carpeta

```bash
cd backend
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Aprobar scripts de build (si pnpm lo pide)

Si ves un mensaje `[ERR_PNPM_IGNORED_BUILDS]`, corre:

```bash
pnpm approve-builds
```

y aprueba el/los paquete(s) que te muestre (ej. `esbuild`).

### 4. Crear el archivo `.env`

Crea un archivo `.env` dentro de `backend` con:

```dotenv
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/gestion_gastos?schema=public"
JWT_SECRET="pon_aqui_un_texto_largo_y_aleatorio"
PORT=3000
```

Para generar un `JWT_SECRET` seguro:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ⚠️ Este archivo nunca se sube a GitHub. Créalo manualmente en cada computadora.

### 5. Generar el cliente de Prisma

```bash
pnpm prisma generate
```

### Migrar la bse de datos
```bash
pnpm prisma migrate dev
```

### 6. Levantar el servidor

```bash
pnpm dev
```

Backend corriendo en `http://localhost:3000`.

---

## Frontend (Angular)

### 1. Entrar a la carpeta (en otra terminal)

```bash
cd front
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Aprobar scripts de build (si pnpm lo pide)

```bash
pnpm approve-builds
```

### Implementar angular

```bash
pnpm add -D @angular/cli
```

### Implementar api de google

```bash
pnpm add @abacritt/angularx-social-login
```

### 4. Levantar el servidor de desarrollo

```bash
pnpm start
```

Frontend corriendo en `http://localhost:4200`.

---

## Resumen rápido

```bash
# Backend
cd backend
pnpm install
pnpm approve-builds
# crear .env manualmente
pnpm prisma generate
pnpm dev

# Frontend (otra terminal)
cd front
pnpm install
pnpm approve-builds
pnpm start
```
