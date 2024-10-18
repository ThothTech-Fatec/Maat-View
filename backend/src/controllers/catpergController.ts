import { Request, Response } from 'express';
import pool from '../config/database.js';

// Endpoint para buscar categorias existentes
export const buscarCategorias = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        const [rows]: [any[], any] = await pool.query(
            'SELECT categoria FROM Categoria_Perguntas WHERE categoria LIKE ?',
            [`%${query}%`]
        );

        return res.status(200).json(rows.map(row => row.categoria));
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ message: 'Erro ao buscar categorias.' });
    }
};

// Endpoint para cadastrar nova categoria
export const cadastrarCategoria = async (req: Request, res: Response) => {
    try {
        const { categoria } = req.body;

        // Verificar se a categoria já existe
        const [rows]: [any[], any] = await pool.query(
            'SELECT id FROM Categoria_Perguntas WHERE categoria = ?',
            [categoria]
        );

        if (rows.length > 0) {
            return res.status(400).json({ message: 'Categoria já existe!' });
        }

        // Inserir nova categoria
        await pool.query('INSERT INTO Categoria_Perguntas (categoria) VALUES (?)', [categoria]);

        return res.status(201).json({ message: 'Categoria cadastrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar categoria:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar categoria.' });
    }
};
