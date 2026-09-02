import type { Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:admin@localhost:5432/gestion_gastos?schema=public" 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const getMovimientos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    
    const movimientos = await (prisma as any).gasto.findMany({
      where: { userId: Number(usuarioId) }
    });

    res.json(movimientos);
  } catch (error: any) {
    console.error("ERROR AL OBTENER MOVIMIENTOS:", error);
    res.status(500).json({ error: 'Error al obtener los movimientos' });
  }
};