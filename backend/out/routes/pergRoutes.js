import express from 'express';
import { cadastrarPergunta } from '../controllers/pesqController.js';
const router = express.Router();
router.post('/cadastrarpergunta', cadastrarPergunta);
export default router;
