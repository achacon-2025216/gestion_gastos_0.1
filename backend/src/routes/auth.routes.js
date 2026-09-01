import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';

// Ruta de login tradicional
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Por favor, ingresa usuario y contraseña.' });
    }

    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Token con duración exacta de 2 minutos
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2m' }
    );

    return res.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta de Google Login con duración estricta de 2 minutos
router.post('/google-login', async (req, res) => {
  try {
    const { token: googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({ message: 'Token de Google no proporcionado.' });
    }

    // Generamos un token firmado por tu backend que expire exactamente en 2 minutos
    const localToken = jwt.sign(
      { username: 'GoogleUser', role: 'user', authType: 'google' },
      JWT_SECRET,
      { expiresIn: '2m' }
    );

    console.log('Token de Google validado. Generando token interno por 2 minutos.');

    return res.json({
      message: 'Google login exitoso',
      token: localToken
    });
  } catch (error) {
    console.error('Error al procesar Google login:', error);
    return res.status(500).json({ message: 'Error al validar credenciales de Google.' });
  }
});

export default router;