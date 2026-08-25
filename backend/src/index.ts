import express from 'express';
import cors from 'cors';
import authRoutes from './controllers/authController.js';// Ajusta el nombre de tu archivo

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());

// Esto hace que la ruta final sea /api/register y /api/login
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});