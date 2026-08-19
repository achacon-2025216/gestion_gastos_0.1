# gestion_gastos_2025216

<<<<<<< HEAD
=========================================
INSTALACION DE DEPENDENCIAS - gestion_gastos_2025216
=========================================

-----------------------------------------
BACKEND (parado dentro de la carpeta backend)
-----------------------------------------

cd backend

pnpm install

pnpm add express cors bcrypt jsonwebtoken dotenv pg
pnpm add @prisma/client @prisma/adapter-pg
pnpm add -D prisma typescript tsx @types/express @types/cors @types/bcrypt @types/jsonwebtoken @types/pg @types/node


-----------------------------------------
FRONTEND (parado dentro de la carpeta front)
-----------------------------------------

cd front

pnpm install


-----------------------------------------
CONFIGURACION DE BASE DE DATOS (dentro de backend)
-----------------------------------------

Crear la base de datos en PostgreSQL:
psql -U postgres -c "CREATE DATABASE gestion_gastos;"

Crear archivo .env dentro de backend con:

DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/gestion_gastos?schema=public"
JWT_SECRET="pon_aqui_un_secreto_largo_y_aleatorio"
PORT=3000

Aplicar migraciones:
pnpm prisma migrate dev

Generar cliente de Prisma:
pnpm prisma generate


-----------------------------------------
LEVANTAR EL PROYECTO
-----------------------------------------

Backend (dentro de backend):
pnpm dev

Frontend (dentro de front, en otra terminal):
pnpm start
(o si no existe ese script: npx ng serve)


-----------------------------------------
TABLA DE REFERENCIA - PARA QUE SIRVE CADA PAQUETE (BACKEND)
-----------------------------------------

express              -> el servidor web/API
cors                  -> permite que Angular le hable al backend
bcrypt                -> encripta contraseñas
jsonwebtoken          -> crea y verifica el token de sesion (JWT)
dotenv                -> carga el archivo .env
pg                     -> driver de conexion a PostgreSQL
@prisma/client         -> cliente de Prisma para hacer consultas
@prisma/adapter-pg     -> adaptador que conecta Prisma con pg (obligatorio en Prisma 7)
prisma                 -> CLI de Prisma (migraciones, generate, etc.)
tsx                    -> corre TypeScript directo sin compilar antes
@types/...              -> le dan a TypeScript la info de tipos de cada paquete
=======
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
>>>>>>> achacon-2025216
