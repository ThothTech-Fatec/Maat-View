import { Request, Response } from 'express';
import pool from '../config/database.js';

export const getEvaluationCounts = async (req: Request, res: Response) => {
    const { dateFilter } = req.query; // Recebe o filtro de data via query string

    // Define a condição de data com base no filtro
    let dateCondition = '';
    if (dateFilter === 'week') {
        dateCondition = `WHERE p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`;
    } else if (dateFilter === 'month') {
        dateCondition = `WHERE p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`;
    } else if (dateFilter === 'year') {
        dateCondition = `WHERE p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)`;
    }

    try {
        // Consulta para contar os diferentes tipos de avaliações
        const [countsRows] = await pool.execute(
            `SELECT 
                SUM(CASE WHEN p.cat_pes = 'Auto Avaliação' THEN 1 ELSE 0 END) AS autoAvaliacao,
                SUM(CASE WHEN p.cat_pes = 'Avaliação de Liderado' THEN 1 ELSE 0 END) AS avaliacaoLiderado,
                SUM(CASE WHEN p.cat_pes = 'Avaliação de Líder' THEN 1 ELSE 0 END) AS avaliacaoLider
             FROM Pesquisas p
             ${dateCondition}`,
            []
        );

        const counts = countsRows as {
            autoAvaliacao: number;
            avaliacaoLiderado: number;
            avaliacaoLider: number;
        }[];

        // Retornar resposta
        return res.status(200).json({
            autoAvaliacao: counts[0]?.autoAvaliacao || 0,
            avaliacaoLiderado: counts[0]?.avaliacaoLiderado || 0,
            avaliacaoLider: counts[0]?.avaliacaoLider || 0,
        });
    } catch (error) {
        console.error('Erro ao buscar contagem de avaliações:', error);
        return res.status(500).json({ error: 'Erro ao buscar contagem de avaliações.' });
    }
};


export const getUserActivityByMonth = async (req: Request, res: Response) => {
    try {
        // Recebe o filtro de data (week, month, year) via query string
        const { dateFilter } = req.query;

        // Define a condição de data com base no filtro
        let dateCondition = '';
        if (dateFilter === 'week') {
            dateCondition = `WHERE r.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`;
        } else if (dateFilter === 'month') {
            dateCondition = `WHERE r.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`;
        } else if (dateFilter === 'year') {
            dateCondition = `WHERE r.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)`;
        }

        // Consulta para contar o número de respostas únicas (user_id e per_id) agrupadas por mês, com base no filtro de data
        const [activityRows] = await pool.execute(
            `SELECT 
                DATE_FORMAT(r.data_criacao, '%Y-%m') AS mes, 
                COUNT(DISTINCT CONCAT(r.user_id, '_', r.per_id)) AS total_respostas
             FROM Respostas r
             ${dateCondition}
             GROUP BY mes
             ORDER BY mes ASC`,
            []
        );

        // Formatar os resultados
        const activity = activityRows as { mes: string; total_respostas: number }[];

        // Retornar os dados formatados
        return res.status(200).json(activity);
    } catch (error) {
        console.error('Erro ao buscar atividade dos usuários:', error);
        return res.status(500).json({ error: 'Erro ao buscar atividade dos usuários.' });
    }
};

/// Função para contar perguntas pendentes e respondidas com filtro de data
const contarPerguntasGeraisComData = async (req: Request, res: Response) => {
    try {
      // Recebe o filtro de data (week, month, year) via query string
      const { dateFilter } = req.query;
  
      // Define a condição de data com base no filtro
      let dateConditionPerguntas = '';
      let dateConditionRespostas = '';
      if (dateFilter === 'week') {
        dateConditionPerguntas = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`;
        dateConditionRespostas = `AND r.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`;
      } else if (dateFilter === 'month') {
        dateConditionPerguntas = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`;
        dateConditionRespostas = `AND r.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`;
      } else if (dateFilter === 'year') {
        dateConditionPerguntas = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)`;
        dateConditionRespostas = `AND r.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)`;
      }
  
      // 1. Contar total de perguntas a serem respondidas (perguntas no período * usuários não admin no período)
      const totalPerguntasAResponderQuery = `
        SELECT COUNT(p.id) * (
          SELECT COUNT(*) FROM Users WHERE cargo != 'Admin'
        ) AS total_perguntas_a_responder
        FROM Perguntas p
        JOIN Pesquisas_Perguntas pp ON p.id = pp.per_id
        JOIN Pesquisas pes ON pp.pes_id = pes.id
        WHERE pes.cat_pes = 'Auto Avaliação' ${dateConditionPerguntas}`;
      
      const [totalPerguntasAResponderResult] = await pool.execute(totalPerguntasAResponderQuery);
      const totalPerguntasAResponder = (totalPerguntasAResponderResult as any[])[0]?.total_perguntas_a_responder || 0;
  
      // 2. Contar perguntas respondidas (perguntas de autoavaliação respondidas por pelo menos um usuário)
      const perguntasRespondidasQuery = `
        SELECT COUNT(DISTINCT r.per_id) AS perguntas_respondidas
        FROM Respostas r
        JOIN Perguntas p ON r.per_id = p.id
        JOIN Pesquisas_Perguntas pp ON p.id = pp.per_id
        JOIN Pesquisas pes ON pp.pes_id = pes.id
        WHERE pes.cat_pes = 'Auto Avaliação' ${dateConditionRespostas}`;
      
      const [perguntasRespondidasResult] = await pool.execute(perguntasRespondidasQuery);
      const perguntasRespondidas = (perguntasRespondidasResult as any[])[0]?.perguntas_respondidas || 0;
  
      // 3. Calcular o total de perguntas restantes
      const totalPerguntasRestantes = totalPerguntasAResponder - perguntasRespondidas;
  
      // Retornar os resultados
      res.json({
        totalPerguntasAResponder,
        perguntasRespondidas,
        totalPerguntasRestantes
      });
    } catch (error) {
      console.error('Erro ao contar perguntas:', error);
      res.status(500).json({ error: 'Erro ao contar perguntas' });
    }
  };
  
  
  export default contarPerguntasGeraisComData;