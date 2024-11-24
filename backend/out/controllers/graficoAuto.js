import pool from '../config/database.js';
export const getAutoavaliacaoProgresso = async (req, res) => {
    var _a, _b;
    const { userId } = req.params;
    const { dateFilter } = req.query; // Recebe o filtro de data via query string
    // Mapear filtros para intervalos de data
    let dateCondition = '';
    if (dateFilter === 'week') {
        dateCondition = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)`;
    }
    else if (dateFilter === 'month') {
        dateCondition = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`;
    }
    else if (dateFilter === 'year') {
        dateCondition = `AND p.data_criacao >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)`;
    }
    try {
        // Total de perguntas de autoavaliação
        const [totalQuestionsRows] = await pool.execute(`SELECT COUNT(DISTINCT pp.per_id) AS total
             FROM Pesquisas p
             JOIN Pesquisas_Perguntas pp ON pp.pes_id = p.id
             WHERE p.cat_pes = 'Auto Avaliação'
             ${dateCondition}`, []);
        const totalQuestions = totalQuestionsRows;
        // Total de perguntas respondidas pelo usuário em autoavaliações
        const [answeredQuestionsRows] = await pool.execute(`SELECT COUNT(DISTINCT r.per_id) AS answered
             FROM Respostas r
             JOIN Pesquisas p ON r.pes_id = p.id
             WHERE r.user_id = ? 
               AND p.cat_pes = 'Auto Avaliação'
             ${dateCondition}`, [userId]);
        const answeredQuestions = answeredQuestionsRows;
        // Total e restantes
        const total = ((_a = totalQuestions[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const answered = ((_b = answeredQuestions[0]) === null || _b === void 0 ? void 0 : _b.answered) || 0;
        const remaining = total - answered;
        // Perguntas não respondidas pelo usuário
        const [unansweredQuestionsRows] = await pool.execute(`SELECT DISTINCT pp.per_id, pe.sobre AS pergunta, p.titulo, p.sobre
             FROM Pesquisas p
             JOIN Pesquisas_Perguntas pp ON pp.pes_id = p.id
             JOIN Perguntas pe ON pe.id = pp.per_id
             LEFT JOIN Respostas r ON r.per_id = pp.per_id AND r.user_id = ?
             WHERE p.cat_pes = 'Auto Avaliação'
               AND r.id IS NULL
             ${dateCondition}`, [userId]);
        const unansweredQuestions = unansweredQuestionsRows;
        // Retornar resposta
        return res.status(200).json({
            progresso: {
                total,
                answered,
                remaining,
            },
            perguntasNaoRespondidas: unansweredQuestions,
        });
    }
    catch (error) {
        console.error('Erro ao buscar progresso da autoavaliação:', error);
        return res.status(500).json({ error: 'Erro ao buscar progresso da autoavaliação.' });
    }
};
