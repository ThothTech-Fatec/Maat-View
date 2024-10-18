import { Request, Response } from 'express';
import pool from '../config/database.js';


// Função para cadastrar pesquisa
export const cadastrarPesquisa = async (req: Request, res: Response) => {
    try {
        const { titlePes, sobrepesq, catpesq } = req.body;

        // Inserir a pesquisa no banco de dados
        await pool.query(
            'INSERT INTO Pesquisas (titulo, sobre, cat_pes) VALUES (?, ?, ?)', 
            [titlePes, sobrepesq, catpesq]
        );

        return res.status(201).json({ message: 'Pesquisa cadastrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar pesquisa:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar pesquisa.' });
    }
};

/// Função para cadastrar perguntas e vincular à pesquisa
export const cadastrarPergunta = async (req: Request, res: Response) => {
    try {
        const { titlePes,categoriaPergunta, sobrePergunta, formatoPergunta, options } = req.body;

        // Buscar o ID da pesquisa pelo título
        const [rows]: [any[], any] = await pool.query('SELECT id FROM Pesquisas WHERE titulo = ?', [titlePes]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pesquisa não encontrada!' });
        }

        const pesquisaId = rows[0].id;

        // Inserir a pergunta no banco de dados e vincular à pesquisa
        await pool.query(
            'INSERT INTO Perguntas (cat_id, sobre, formato) VALUES (?, ?, ?)', 
            [categoriaPergunta, sobrePergunta, formatoPergunta]  
        );

        // Buscar o ID da pergunta inserida
        const [pergunta]: [any[], any] = await pool.query('SELECT id FROM Perguntas WHERE sobre = ?', [sobrePergunta]);

        if (pergunta.length === 0) {
            return res.status(404).json({ message: 'Pergunta não encontrada após inserção.' });
        }

        const perguntaId = pergunta[0].id;

        // Agora vincular a pergunta à pesquisa usando a tabela `Pesquisas_Perguntas`
        await pool.query(
            'INSERT INTO Pesquisas_Perguntas (pes_id, per_id) VALUES (?, ?)', 
            [pesquisaId, perguntaId]
        );

        // Inserir as opções, se houver
        if (options && options.length > 0) {
            for (const option of options) {
                await pool.query(
                    'INSERT INTO Opções (per_id, pes_id, texto) VALUES (?, ?, ?)',
                    [perguntaId, pesquisaId, option]
                );
            }
        }

        return res.status(201).json({ message: 'Pergunta cadastrada e vinculada à pesquisa com sucesso!' });

    } catch (error) {
        console.error('Erro ao cadastrar pergunta:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar pergunta.' });
    }
};
