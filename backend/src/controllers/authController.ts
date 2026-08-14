import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura';

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

  try {
    const newUser = await prisma.user.create({
      data: { username, password, role },
    });
    return res.status(201).json({
      message: `Usuario registrado exitosamente como ${role}`,
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};