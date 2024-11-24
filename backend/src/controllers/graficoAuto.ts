import { Request, Response } from 'express';
import pool from '../config/database.js';

export const getAutoavaliacaoProgresso = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { dateFilter } = req.query; // Recebe o filtro de data via query string

    // Mapear filtros para intervalos de data
    let dateCondition = '';
    if (dateFilter === 'week') {
        dateCondition = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`;
    } else if (dateFilter === 'month') {
        dateCondition = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`;
    } else if (dateFilter === 'year') {
        dateCondition = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)`;
    }

    try {
        // Total de perguntas de autoavaliação
        const [totalQuestionsRows] = await pool.execute(
            `SELECT COUNT(DISTINCT pp.per_id) AS total
             FROM Pesquisas p
             JOIN Pesquisas_Perguntas pp ON pp.pes_id = p.id
             WHERE p.cat_pes = 'Auto Avaliação'
             ${dateCondition}`,
            []
        );
        const totalQuestions = totalQuestionsRows as { total: number }[];

        // Total de perguntas respondidas pelo usuário em autoavaliações
        const [answeredQuestionsRows] = await pool.execute(
            `SELECT COUNT(DISTINCT r.per_id) AS answered
             FROM Respostas r
             JOIN Pesquisas p ON r.pes_id = p.id
             WHERE r.user_id = ? 
               AND p.cat_pes = 'Auto Avaliação'
             ${dateCondition}`,
            [userId]
        );
        const answeredQuestions = answeredQuestionsRows as { answered: number }[];

        // Total e restantes
        const total = totalQuestions[0]?.total || 0;
        const answered = answeredQuestions[0]?.answered || 0;
        const remaining = total - answered;

        // Perguntas não respondidas pelo usuário
        const [unansweredQuestionsRows] = await pool.execute(
            `SELECT DISTINCT pp.per_id, pe.sobre AS pergunta, p.titulo, p.sobre
             FROM Pesquisas p
             JOIN Pesquisas_Perguntas pp ON pp.pes_id = p.id
             JOIN Perguntas pe ON pe.id = pp.per_id
             LEFT JOIN Respostas r ON r.per_id = pp.per_id AND r.user_id = ?
             WHERE p.cat_pes = 'Auto Avaliação'
               AND r.id IS NULL
             ${dateCondition}`,
            [userId]
        );

        const unansweredQuestions = unansweredQuestionsRows as {
            per_id: number;
            pergunta: string;
            titulo: string;
            sobre: string;
        }[];

        // Retornar resposta
        return res.status(200).json({
            progresso: {
                total,
                answered,
                remaining,
            },
            perguntasNaoRespondidas: unansweredQuestions,
        });
    } catch (error) {
        console.error('Erro ao buscar progresso da autoavaliação:', error);
        return res.status(500).json({ error: 'Erro ao buscar progresso da autoavaliação.' });
    }
};
