import { Router } from 'express';
import { getMovimientos } from '../controllers/gastoController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router: Router = Router();

// Esta ruta intercepta el token, valida que sea correcto y devuelve solo los gastos del usuario autenticado
router.get('/gastos', verifyToken, getMovimientos);

export default router;