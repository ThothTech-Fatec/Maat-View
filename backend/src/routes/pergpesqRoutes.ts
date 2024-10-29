import express from 'express';
import { PerguntasPesquisas } from '../controllers/suasAvaliaçõesController';

const router = express.Router();

router.post('/', PerguntasPesquisas );

export default router;
