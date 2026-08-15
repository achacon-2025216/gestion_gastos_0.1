import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Configuración obligatoria del adaptador para Prisma v7 con PostgreSQL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'admin';

// Registro de usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'El usuario y la contraseña son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar la contraseña de forma segura
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'user'
      }
    });

    return res.status(201).json({
      message: '¡Usuario registrado con éxito!',
      user: { id: newUser.id, username: newUser.username, role: newUser.role }
    });

  } catch (error: any) {
    console.error('ERROR EN REGISTRO:', error);
    return res.status(500).json({ error: 'Error interno al registrar el usuario' });
  }
};

// Inicio de sesión
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Generar el token JWT con los datos del usuario
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      message: 'Login exitoso',
      token,
      role: user.role
    });

  } catch (error: any) {
    console.error('ERROR EN LOGIN:', error);
    return res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};