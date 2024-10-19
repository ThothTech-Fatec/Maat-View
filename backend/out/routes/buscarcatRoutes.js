import express from 'express';
import { buscarCategorias } from '../controllers/catpergController.js';
const router = express.Router();
router.post('/categorias', buscarCategorias);
export default router;
