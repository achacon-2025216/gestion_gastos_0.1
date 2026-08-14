import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

// Rutas de autenticación
router.post('/register', registerUser);
router.post('/login', loginUser); // <--- Esta es la ruta que causaba el error 404

export default router;