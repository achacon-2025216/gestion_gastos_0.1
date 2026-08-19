import type { Response } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const getMovimientos = async (req: AuthRequest, res: Response) => {
  try {
    // Forzamos la lectura de la propiedad del usuario sin restricciones de tipo
    const usuarioId = (req.user as any)?.userId || (req.user as any)?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    
    // Forzamos el acceso al modelo de Prisma para evitar el error de tipado
    const movimientos = await (prisma as any).gasto.findMany({
      where: { userId: Number(usuarioId) }
    });

    return res.json(movimientos);
  } catch (error: any) {
    console.error("ERROR AL OBTENER MOVIMIENTOS:", error);
    return res.status(500).json({ error: 'Error al obtener los movimientos' });
  }
};