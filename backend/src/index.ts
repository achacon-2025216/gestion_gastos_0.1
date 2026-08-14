import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import authRoutes from './routes/authRoutes.js';
import gastoRoutes from './routes/gastoRoutes.js';

// Configurar la conexión con el pool de Postgres y el adaptador de Prisma
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

app.use(cors());
app.use(express.json());

// Registrar rutas de la API
app.use('/api', authRoutes);
app.use('/api', gastoRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});