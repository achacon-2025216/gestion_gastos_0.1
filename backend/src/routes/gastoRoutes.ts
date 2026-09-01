import { Router } from 'express';
import { getMovimientos } from '../controllers/gastoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router: Router = Router();

// Ruta protegida que requiere token válido y no expirado
router.get('/gastos', verifyToken, getMovimientos);

export default router;