import express from 'express';
import { cadastrarUsuario } from '../controllers/userController.js';
import { cadastrarPesquisa } from '../controllers/pesqController.js';
import { buscarCategorias, cadastrarCategoria } from '../controllers/catpergController.js';

const router = express.Router();

router.post('/cadastropergcategoria', cadastrarCategoria );
router.post('/categorias', buscarCategorias)

export default router;