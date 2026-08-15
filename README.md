# gestion_gastos_2025216

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