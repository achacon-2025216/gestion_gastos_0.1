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
      where: { userId: Number(usuarioId) },
      orderBy: { fecha: 'desc' }
    });

    res.json(movimientos);
  } catch (error: any) {
    console.error("ERROR AL OBTENER MOVIMIENTOS:", error);
    res.status(500).json({ error: 'Error al obtener los movimientos' });
  }
};

export const crearMovimiento = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    const { descripcion, categoria, tipo, monto, fecha } = req.body;

    if (!usuarioId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    if (!descripcion?.trim() || !categoria?.trim() || !['ingreso', 'egreso'].includes(tipo) || Number(monto) <= 0) {
      res.status(400).json({ error: 'Datos de movimiento inválidos' });
      return;
    }

    const movimiento = await (prisma as any).gasto.create({
      data: {
        descripcion: descripcion.trim(),
        categoria: categoria.trim(),
        tipo,
        monto: Number(monto),
        fecha: fecha ? new Date(fecha) : new Date(),
        userId: Number(usuarioId)
      }
    });

    res.status(201).json(movimiento);
  } catch (error: any) {
    console.error('ERROR AL CREAR MOVIMIENTO:', error);
    res.status(500).json({ error: 'Error al crear el movimiento' });
  }
};

export const eliminarMovimiento = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    const movimientoId = Number(req.params.id);

    if (!usuarioId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const movimiento = await (prisma as any).gasto.findFirst({
      where: { id: movimientoId, userId: Number(usuarioId) }
    });

    if (!movimiento) {
      res.status(404).json({ error: 'Movimiento no encontrado' });
      return;
    }

    await (prisma as any).gasto.delete({ where: { id: movimientoId } });
    res.status(204).send();
  } catch (error: any) {
    console.error('ERROR AL ELIMINAR MOVIMIENTO:', error);
    res.status(500).json({ error: 'Error al eliminar el movimiento' });
  }
};
