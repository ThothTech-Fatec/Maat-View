import { Request, Response } from 'express';
import pool from '../config/database.js';

// Definir um tipo customizado para Request, incluindo as propriedades extras
interface CustomRequest extends Request {
  pesquisaId?: number;
  user?: { id: number };
}
interface Resposta {
  per_id: number;
  resp_texto: string | null;
  select_option_id: number | null;
}

// Função para buscar todas as pesquisas e suas categorias
export const getPesquisas = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT Pesquisas.id, Pesquisas.titulo, Pesquisas.sobre, Pesquisas.cat_pes
      FROM Pesquisas
      LEFT JOIN Categoria_Perguntas ON Categoria_Perguntas.id = Pesquisas.cat_pes
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar pesquisas:", error);
    res.status(500).json({ message: "Erro ao buscar pesquisas." });
  }
};

// Função para buscar perguntas de uma pesquisa específica e incluir opções para perguntas de escolha única/múltipla
export const PerguntasPesquisas = async (req: CustomRequest, res: Response) => {
  const { pesquisaId } = req.params;

  try {
    if (!pesquisaId) {
      return res.status(400).json({ message: "ID da pesquisa não fornecido." });
    }

    const [perguntas] = await pool.query(`
      SELECT p.id, p.sobre, p.formato
      FROM Perguntas p
      JOIN Pesquisas_Perguntas pp ON pp.per_id = p.id
      WHERE pp.pes_id = ?
    `, [pesquisaId]);

    const perguntasComOpcoes = await Promise.all((perguntas as any[]).map(async (pergunta: any) => {
      if (['Escolha Única', 'Múltipla Escolha'].includes(pergunta.formato)) {
        const [opcoes] = await pool.query(`
          SELECT id, texto 
          FROM Opções 
          WHERE per_id = ?
        `, [pergunta.id]);
        return { ...pergunta, opcoes };
      }
      return pergunta;
    }));

    res.json(perguntasComOpcoes);
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    res.status(500).json({ message: 'Erro ao buscar perguntas.' });
  }
};

// Função para salvar as respostas dos usuários
export const SaveAnswer = async (req: CustomRequest, res: Response) => {
  const { respostas, userId }: { respostas: Resposta[], userId: number } = req.body;

  try {
    // Verificar se o ID da pesquisa foi fornecido
    if (!req.pesquisaId) {
      return res.status(400).json({ message: 'ID da pesquisa não especificado.' });
    }

    // Validar as respostas
    if (!Array.isArray(respostas) || respostas.length === 0) {
      return res.status(400).json({ message: 'Respostas inválidas ou não fornecidas.' });
    }

    const insertPromises = respostas.map((resposta) => {
      const { per_id, resp_texto, select_option_id } = resposta;

      // Validar cada resposta
      if (typeof per_id !== 'number') {
        throw new Error(`ID da pergunta inválido: ${per_id}`);
      }

      return pool.query(`
        INSERT INTO Respostas (user_id, per_id, pes_id, resp_texto, select_option_id)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, per_id, req.pesquisaId, resp_texto, select_option_id]); // usar userId aqui
    });

    await Promise.all(insertPromises);

    res.status(201).json({ message: 'Respostas salvas com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar respostas:', error);
    res.status(500).json({ message: 'Erro ao salvar respostas.' });
  }
};

