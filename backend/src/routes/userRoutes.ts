import express from 'express';
import { cadastrarUsuario } from '../controllers/userController.js';
import { cadastrarPesquisa } from '../controllers/pesqController.js';

const router = express.Router();

router.post('/usuarios', cadastrarUsuario);

export default router;
