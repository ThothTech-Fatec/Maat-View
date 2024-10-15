import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js'; // Importando as rotas de usuário
const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Ajuste conforme sua configuração
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());
// Usando as rotas com o prefixo /api
app.use('/api', authRoutes);
app.use('/api', userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
