import { Request, Response } from 'express';
import pool from '../config/database.js';

interface CustomRequest extends Request {
  pesquisaId?: number;
  user?: { id: number };
}
interface Resposta {
  per_id: number;
  resp_texto: string | null;
  select_option_id: number | null;
}

// Função para buscar todas as pesquisas, suas categorias e avaliações de liderados pendentes
export const getPesquisas = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    // Consulta 1: Pesquisas de Auto Avaliação que o usuário ainda não respondeu
    const [autoAvaliacaoRows] = await pool.query(`
      SELECT 
        Pesquisas.id, 
        Pesquisas.titulo, 
        Pesquisas.sobre, 
        Pesquisas.cat_pes,
        Categoria_Perguntas.categoria AS categoria_nome
      FROM Pesquisas
      LEFT JOIN Categoria_Perguntas ON Categoria_Perguntas.id = Pesquisas.cat_pes
      LEFT JOIN Avaliacoes ON Avaliacoes.pes_id = Pesquisas.id 
        AND Avaliacoes.user_id = ? -- Verifica se a avaliação pertence ao usuário
      WHERE Pesquisas.cat_pes = 'Auto Avaliação'
      GROUP BY Pesquisas.id, Categoria_Perguntas.categoria
      HAVING COUNT(Avaliacoes.id) = 0 -- Somente pesquisas que não têm avaliações para o usuário
    `, [userId]);

    // Consulta 2: Pesquisas onde o usuário é o responsável pela avaliação
    const [avaliacoesResponsavelRows] = await pool.query(`
      SELECT 
        Pesquisas.id, 
        Pesquisas.titulo, 
        Pesquisas.sobre, 
        Pesquisas.cat_pes,
        Categoria_Perguntas.categoria AS categoria_nome
      FROM Pesquisas
      LEFT JOIN Categoria_Perguntas ON Categoria_Perguntas.id = Pesquisas.cat_pes
      INNER JOIN Avaliacoes ON Avaliacoes.pes_id = Pesquisas.id 
        AND Avaliacoes.responsavel_id = ? -- Verifica se o usuário é o responsável pela avaliação
      GROUP BY Pesquisas.id, Categoria_Perguntas.categoria
    `, [userId]);

    // Combina os resultados das duas consultas em um único objeto
    res.json({
      autoAvaliacao: autoAvaliacaoRows,
      avaliacoesResponsavel: avaliacoesResponsavelRows
    });
  } catch (error) {
    console.error("Erro ao buscar pesquisas e avaliações do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar pesquisas e avaliações do usuário." });
  }
};


export const PerguntasPesquisas = async (req: CustomRequest, res: Response) => {
  const { pesquisaId } = req.params;

  try {
    if (!pesquisaId) {
      return res.status(400).json({ message: "ID da pesquisa não fornecido." });
    }

    // Verifica a categoria da pesquisa
    const [pesquisaResult] = await pool.query(`
      SELECT cat_pes 
      FROM Pesquisas 
      WHERE id = ?
    `, [pesquisaId]);

    const pesquisa = pesquisaResult as any[]; // Assegura que `pesquisaResult` é tratado como um array

    if (pesquisa.length === 0) {
      return res.status(404).json({ message: "Pesquisa não encontrada." });
    }

    const categoria = pesquisa[0].cat_pes;

    // Busca as perguntas relacionadas à pesquisa
    const [perguntasResult] = await pool.query(`
      SELECT p.id, p.sobre, p.formato
      FROM Perguntas p
      JOIN Pesquisas_Perguntas pp ON pp.per_id = p.id
      WHERE pp.pes_id = ?
    `, [pesquisaId]);

    const perguntas = perguntasResult as any[];

    // Itera sobre as perguntas para incluir opções (se for o caso) e respostas (para categorias específicas)
    const perguntasComRespostas = await Promise.all(perguntas.map(async (pergunta: any) => {
      let opcoes = null;
      let respostas = null;

      // Inclui as opções para perguntas de escolha única ou múltipla escolha
      if (['Escolha Única', 'Múltipla Escolha'].includes(pergunta.formato)) {
        const [optionsResult] = await pool.query(`
          SELECT id, texto 
          FROM Opções 
          WHERE per_id = ?
        `, [pergunta.id]);
        opcoes = optionsResult;
      }

      // Se a categoria for "Avaliação de Liderado" ou "Avaliação de Líder", busca as respostas do Temp_Respostas
      if (['Avaliação de Liderado', 'Avaliação de Líder'].includes(categoria)) {
        const [tempRespostasResult] = await pool.query(`
          SELECT tr.resp_texto, tr.select_option_id 
          FROM Temp_Respostas tr
          WHERE tr.per_id = ? AND tr.ava_id = (
            SELECT id 
            FROM Avaliacoes 
            WHERE pes_id = ? 
            LIMIT 1
          )
        `, [pergunta.id, pesquisaId]);
        respostas = tempRespostasResult;
      }

      // Retorna a pergunta com as opções e, se houver, as respostas
      return { ...pergunta, opcoes, respostas };
    }));

    res.json(perguntasComRespostas);
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    res.status(500).json({ message: 'Erro ao buscar perguntas.' });
  }
};



export const SaveAnswer = async (req: Request, res: Response) => {
  const { respostas, userId, pesquisaId } = req.body;
  console.log('Dados recebidos no backend:', req.body);

  try {
    // Obter as perguntas relacionadas à pesquisa específica
    const [perguntasResult]: any = await pool.query(
      'SELECT per_id FROM Pesquisas_Perguntas WHERE pes_id = ?',
      [pesquisaId]
    );

    const perguntasIds = perguntasResult.map((pergunta: any) => pergunta.per_id);

    // Salvar as respostas do usuário na tabela Respostas
    for (let resposta of respostas) {
      if (perguntasIds.includes(resposta.per_id)) {
        if (Array.isArray(resposta.select_option_id)) {
          for (let optionId of resposta.select_option_id) {
            await pool.query(
              'INSERT INTO Respostas (per_id, user_id, pes_id, select_option_id) VALUES (?, ?, ?, ?)',
              [resposta.per_id, userId, pesquisaId, optionId]
            );
          }
        } else {
          await pool.query(
            'INSERT INTO Respostas (per_id, user_id, pes_id, resp_texto, select_option_id) VALUES (?, ?, ?, ?, ?)',
            [resposta.per_id, userId, pesquisaId, resposta.resp_texto, resposta.select_option_id]
          );
        }
      }
    }

    // Obter o cargo do usuário para determinar o tipo de avaliação
    const [userResult]: any = await pool.query('SELECT cargo, sub_cargo, lider_id, nome FROM Users WHERE id = ?', [userId]);
    const user = userResult[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar a categoria da pesquisa
    const [pesquisaResult]: any = await pool.query('SELECT cat_pes FROM Pesquisas WHERE id = ?', [pesquisaId]);
    const pesquisa = pesquisaResult[0];

    if (pesquisa && pesquisa.cat_pes === 'Auto Avaliação') {
      // Se o usuário é um "Liderado", criar uma avaliação para o líder
      if ((user.cargo === 'Liderado' || user.sub_cargo === 'Liderado') && user.lider_id) {
        const [pesquisaOriginal]: any = await pool.query(
          'SELECT titulo, sobre FROM Pesquisas WHERE id = ?',
          [pesquisaId]
        );
        const tituloOriginal = pesquisaOriginal[0]?.titulo || 'Avaliação';
        const sobreOriginal = pesquisaOriginal[0]?.sobre || 'Descrição padrão';
        const novaPesquisaTitulo = `${tituloOriginal} - Avaliação de ${user.nome}`;

        // Criar uma nova pesquisa para a Avaliação de Liderado
        const novaPesquisaCategoria = 'Avaliação de Liderado';
        const [novaPesquisaResult]: any = await pool.query(
          'INSERT INTO Pesquisas (titulo, sobre, cat_pes) VALUES (?, ?, ?)',
          [novaPesquisaTitulo, sobreOriginal, novaPesquisaCategoria]
        );

        const novaPesquisaId = novaPesquisaResult.insertId;

        // Associar a nova pesquisa às perguntas existentes
        for (const perId of perguntasIds) {
          await pool.query(
            'INSERT INTO Pesquisas_Perguntas (pes_id, per_id) VALUES (?, ?)',
            [novaPesquisaId, perId]
          );
        }

        // Criar uma nova avaliação de liderado
        const [avaliacaoResult]: any = await pool.query(
          'INSERT INTO Avaliacoes (pes_id, user_id, responsavel_id) VALUES (?, ?, ?)',
          [novaPesquisaId, userId, user.lider_id]
        );

        const avaliacaoId = avaliacaoResult.insertId;

        // Duplicar respostas para a nova avaliação de liderado
        for (let resposta of respostas) {
          if (perguntasIds.includes(resposta.per_id)) {
            if (Array.isArray(resposta.select_option_id)) {
              for (let optionId of resposta.select_option_id) {
                await pool.query(
                  'INSERT INTO Temp_Respostas (user_id, per_id, ava_id, select_option_id) VALUES (?, ?, ?, ?)',
                  [user.lider_id, resposta.per_id, avaliacaoId, optionId]
                );
              }
            } else {
              await pool.query(
                'INSERT INTO Temp_Respostas (user_id, per_id, ava_id, resp_texto, select_option_id) VALUES (?, ?, ?, ?, ?)',
                [user.lider_id, resposta.per_id, avaliacaoId, resposta.resp_texto, resposta.select_option_id]
              );
            }
          }
        }
      }

      // Se o usuário é um "Líder", criar uma avaliação para cada liderado
      if (user.cargo === 'Líder') {
        const [lideradosResult]: any = await pool.query(
          'SELECT id, nome FROM Users WHERE lider_id = ?',
          [userId]
        );

        for (const liderado of lideradosResult) {
          const [pesquisaOriginal]: any = await pool.query(
            'SELECT titulo, sobre FROM Pesquisas WHERE id = ?',
            [pesquisaId]
          );
          const tituloOriginal = pesquisaOriginal[0]?.titulo || 'Avaliação';
          const sobreOriginal = pesquisaOriginal[0]?.sobre || 'Descrição padrão';
          const novaPesquisaTitulo = `${tituloOriginal} - Avaliação de ${user.nome}`;

          // Criar uma nova pesquisa para a Avaliação de Líder
          const novaPesquisaCategoria = 'Avaliação de Líder';
          const [novaPesquisaResult]: any = await pool.query(
            'INSERT INTO Pesquisas (titulo, sobre, cat_pes) VALUES (?, ?, ?)',
            [novaPesquisaTitulo, sobreOriginal, novaPesquisaCategoria]
          );

          const novaPesquisaId = novaPesquisaResult.insertId;

          // Associar a nova pesquisa às perguntas existentes
          for (const perId of perguntasIds) {
            await pool.query(
              'INSERT INTO Pesquisas_Perguntas (pes_id, per_id) VALUES (?, ?)',
              [novaPesquisaId, perId]
            );
          }

          // Criar uma nova avaliação de líder com o liderado como responsável
          const [avaliacaoResult]: any = await pool.query(
            'INSERT INTO Avaliacoes (pes_id, user_id, responsavel_id) VALUES (?, ?, ?)',
            [novaPesquisaId, userId, liderado.id]
          );

          const avaliacaoId = avaliacaoResult.insertId;

          // Duplicar respostas para a nova avaliação de líder
          for (let resposta of respostas) {
            if (perguntasIds.includes(resposta.per_id)) {
              if (Array.isArray(resposta.select_option_id)) {
                for (let optionId of resposta.select_option_id) {
                  await pool.query(
                    'INSERT INTO Temp_Respostas (user_id, per_id, ava_id, select_option_id) VALUES (?, ?, ?, ?)',
                    [liderado.id, resposta.per_id, avaliacaoId, optionId]
                  );
                }
              } else {
                await pool.query(
                  'INSERT INTO Temp_Respostas (user_id, per_id, ava_id, resp_texto, select_option_id) VALUES (?, ?, ?, ?, ?)',
                  [liderado.id, resposta.per_id, avaliacaoId, resposta.resp_texto, resposta.select_option_id]
                );
              }
            }
          }
        }
      }
    }

    res.status(200).json({ message: 'Respostas salvas com sucesso e avaliações criadas, se aplicável!' });
  } catch (error) {
    console.error('Erro ao salvar respostas ou criar avaliação:', error);
    res.status(500).json({ message: 'Erro ao salvar respostas ou criar avaliação.' });
  }
};













