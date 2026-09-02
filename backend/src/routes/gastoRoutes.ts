import { Router } from 'express';
import { crearMovimiento, eliminarMovimiento, getMovimientos } from '../controllers/gastoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router: Router = Router();

// Ruta protegida que requiere token válido y no expirado
router.get('/gastos', verifyToken, getMovimientos);
router.post('/gastos', verifyToken, crearMovimiento);
router.delete('/gastos/:id', verifyToken, eliminarMovimiento);

export default router;
