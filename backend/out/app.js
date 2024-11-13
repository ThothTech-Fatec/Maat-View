import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import pesqRoutes from './routes/pesqRoutes.js';
import pergRoutes from './routes/pergRoutes.js';
import catpergRoutes from './routes/catpergRoutes.js';
import { buscarCategorias } from './controllers/catpergController.js';
import { buscarPerguntasPorPesquisa } from './controllers/verpergsController.js';
import { showPesquisas, VerificarPergPes } from './controllers/showpesqController.js';
import { getPesquisas, PerguntasPesquisas, SaveAnswer } from './controllers/suasAvaliaçõesController.js';
import { buscarCategoriaPesquisa, buscarPerguntasTemporarias } from './controllers/buscarPergTemp.js';
import { AtualizarSenha, listarLiderados } from './controllers/userController.js';
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
app.use('/api/verpesquisas', getPesquisas);
app.get('/api/verperguntas/:pesquisaId', PerguntasPesquisas);
app.post('/api/enviarrespostas', SaveAnswer);
app.get('/api/verpesquisas-nao-respondidas/:userId', VerificarPergPes);
app.get('/api/buscarPerguntasTemporarias/:pesquisaId/:userId', buscarPerguntasTemporarias);
app.get('/api/buscarcatpesq/:pesquisaId', buscarCategoriaPesquisa);
app.post('/api/atualizarsenha', AtualizarSenha);
app.use('/api/listarliderados/:userId', listarLiderados);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
