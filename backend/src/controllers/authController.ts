import type { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '../../prisma/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Conexión directa para evitar errores de variables de entorno vacías
const pool = new pg.Pool({ 
  connectionString: "postgresql://postgres:admin@localhost:5432/gestion_gastos?schema=public" 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esto_en_produccion';
const router: Router = Router();

// Registro de usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'El usuario y la contraseña son obligatorios' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '10m' }
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

// Definición de las rutas del Router
router.post('/register', register);
router.post('/login', login);

export default router;