import { Router } from 'express';
import { buscarPerguntasPorPesquisa } from '../controllers/verpergsController.js';
const router = Router();
// Rota para buscar perguntas por ID da pesquisa
router.get('/pesquisa/:id/perguntas', buscarPerguntasPorPesquisa);
export default router;
