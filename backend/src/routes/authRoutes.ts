import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/index.js';
import pg from 'pg';

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:admin@localhost:5432/gestion_gastos?schema=public" 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const router: Router = Router();
const JWT_SECRET: string = process.env.JWT_SECRET || 'cambia_esto_en_produccion';

// POST /api/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'El usuario y la contraseña son obligatorios' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'user'
      }
    });

    res.status(201).json({
      message: '¡Usuario registrado con éxito!',
      user: { id: newUser.id, username: newUser.username, role: newUser.role }
    });
  } catch (error: any) {
    console.error('ERROR EN REGISTRO:', error);
    res.status(500).json({ error: 'Error interno al registrar el usuario' });
  }
});

// POST /api/login (Token configurado a 2 minutos)
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Faltan credenciales' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      return;
    }

    // Token generado con 'id' y duración de 2 minutos
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2m' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      role: user.role,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error: any) {
    console.error('ERROR EN LOGIN:', error);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
});

export default router;