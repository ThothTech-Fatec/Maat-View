import express from 'express';
import { cadastrarCategoria } from '../controllers/catpergController.js';
const router = express.Router();
router.post('/cadastropergcategoria', cadastrarCategoria);
export default router;
