import type { Response } from 'express';
// Importamos desde la carpeta generada localmente donde Prisma sí reconoce el modelo 'gasto'
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const getMovimientos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    const movimientos = await prisma.gasto.findMany({
      where: { userId: Number(userId) }
    });

    return res.json(movimientos);
  } catch (error: any) {
    console.error("ERROR AL OBTENER MOVIMIENTOS:", error);
    return res.status(500).json({ error: 'Error al obtener los movimientos' });
  }
};