import express from 'express';
import { buscarCategorias, cadastrarCategoria } from '../controllers/catpergController.js';
const router = express.Router();
router.post('/cadastropergcategoria', cadastrarCategoria);
router.post('/categorias', buscarCategorias);
export default router;
