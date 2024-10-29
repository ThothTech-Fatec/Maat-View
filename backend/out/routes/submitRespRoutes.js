import express from 'express';
import { SaveAnswer } from '../controllers/suasAvaliaçõesController.js';
const router = express.Router();
// Alterado para POST
router.get('/enviarrespostas', SaveAnswer);
export default router;
