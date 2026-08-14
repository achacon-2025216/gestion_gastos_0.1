import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        role,
      },
    });

    return res.status(201).json({
      message: `Usuario registrado exitosamente como ${role}`,
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};