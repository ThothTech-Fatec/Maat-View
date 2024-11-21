import { Request, Response } from 'express';
import pool from '../config/database.js'; // Assumindo que você tenha um pool de conexões com o banco

// Função para pegar as perguntas e respostas de uma pesquisa específica de um usuário
export const getPerguntasERespostas = async (req: Request, res: Response) => {
    const { userId, pesquisaId } = req.params; // Pega o userId e pesquisaId dos parâmetros da requisição
    
    try {
        // Consulta para pegar as perguntas da pesquisa
        const perguntasQuery = `
            SELECT p.id AS pergunta_id, p.sobre AS pergunta, r.resp_texto AS resposta
            FROM Perguntas p
            LEFT JOIN Respostas r ON p.id = r.per_id AND r.user_id = ?
            WHERE p.cat_id = (SELECT cat_id FROM Pesquisas WHERE id = ?);
        `;
        
        // Executando a consulta e desestruturando a resposta
        const [result] = await pool.query(perguntasQuery, [userId, pesquisaId]);

        // Acessa as linhas (resultados) da consulta
        const perguntas = result as { pergunta_id: number, pergunta: string, resposta: string | null }[];

        // Se não encontrar perguntas, retorna erro
        if (perguntas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma pergunta encontrada para esta pesquisa.' });
        }

        // Retorna as perguntas e as respostas (se existirem)
        return res.status(200).json({ perguntas });
    } catch (error) {
        console.error('Erro ao buscar perguntas e respostas:', error);
        return res.status(500).json({ message: 'Erro ao buscar perguntas e respostas.' });
    }
};
