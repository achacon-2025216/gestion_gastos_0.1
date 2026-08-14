import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura';

// Controlador para Registrar Usuario
export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'El usuario y la contraseña son obligatorios' });
    }

    const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

    const newUser = await prisma.user.create({
      data: { username, password, role },
    });

    return res.status(201).json({
      message: `Usuario registrado exitosamente como ${role}`,
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR EN REGISTRO:", error);
    return res.status(500).json({ error: error.message || 'Error al registrar el usuario' });
  }
};

// Controlador para Iniciar Sesión (Login)
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Ingresa tu usuario y contraseña' });
    }

    const user = await prisma.user.findUnique({ 
      where: { username } 
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      role: user.role,
    });
  } catch (error: any) {
    console.error("DETALLE DEL ERROR EN LOGIN:", error);
    return res.status(500).json({ error: 'Error al iniciar sesión en el servidor' });
  }
};