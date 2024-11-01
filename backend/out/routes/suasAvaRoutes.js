import express from 'express';
import { getPesquisas } from '../controllers/suasAvaliaçõesController.js';
const router = express.Router();
router.get('/verpesquisas', getPesquisas);
export default router;
