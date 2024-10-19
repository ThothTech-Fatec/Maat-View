import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import pesqRoutes from './routes/pesqRoutes.js';
import pergRoutes from './routes/pergRoutes.js';
import catpergRoutes from './routes/catpergRoutes.js';
import { buscarCategorias } from './controllers/catpergController.js';
import { buscarPerguntasPorPesquisa } from './controllers/verpergsController.js';
import { showPesquisas } from './controllers/showpesqController.js';
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
// Usando as rotas com o prefixo /api
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', pesqRoutes);
app.use('/api', pergRoutes);
app.use('/api', catpergRoutes);
app.get('/api/categorias', buscarCategorias);
app.get('/api/pesquisas/:id/perguntas', buscarPerguntasPorPesquisa);
app.get('/api/perguntas/:id', showPesquisas);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
