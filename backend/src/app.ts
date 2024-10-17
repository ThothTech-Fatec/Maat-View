import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js'; // Importando as rotas de usuário
import pesqRoutes from './routes/pesqRoutes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Ajuste conforme sua configuração
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Usando as rotas com o prefixo /api
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', pesqRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


