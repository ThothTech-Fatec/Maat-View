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
        // Total de perguntas gerais para Auto Avaliação e Avaliações onde o usuário é responsável
        const [totalQuestionsRows] = await pool.execute(`SELECT COUNT(DISTINCT pp.per_id) AS total
             FROM Pesquisas p
             JOIN Pesquisas_Perguntas pp ON pp.pes_id = p.id
             LEFT JOIN Avaliacoes a ON a.pes_id = p.id
             WHERE (p.cat_pes = 'Auto Avaliação' 
                    OR (p.cat_pes IN ('Avaliação de Liderado', 'Avaliação de Líder') 
                        AND a.responsavel_id = ?))
             ${dateCondition}`, [userId]);
        const totalQuestions = totalQuestionsRows;
        // Total de respostas já respondidas pelo usuário (únicas por pergunta)
        const [answeredQuestionsRows] = await pool.execute(`SELECT COUNT(DISTINCT r.per_id) AS answered
             FROM Respostas r
             JOIN Pesquisas p ON r.pes_id = p.id
             LEFT JOIN Avaliacoes a ON a.pes_id = p.id
             WHERE r.user_id = ? 
                   AND (p.cat_pes = 'Auto Avaliação' 
                        OR (p.cat_pes IN ('Avaliação de Liderado', 'Avaliação de Líder') 
                            AND a.responsavel_id = ?))
             ${dateCondition}`, [userId, userId]);
        const answeredQuestions = answeredQuestionsRows;
        // Progresso geral
        const total = ((_a = totalQuestions[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const answered = ((_b = answeredQuestions[0]) === null || _b === void 0 ? void 0 : _b.answered) || 0;
        const remaining = total - answered;
        // Progresso por categoria
        const [categoryProgressRows] = await pool.execute(`SELECT 
                p.cat_pes AS categoria,
                COUNT(DISTINCT pp.per_id) AS total,
                SUM(CASE WHEN r.user_id = ? THEN 1 ELSE 0 END) AS answered
             FROM Pesquisas p
             LEFT JOIN Pesquisas_Perguntas pp ON pp.pes_id = p.id
             LEFT JOIN Respostas r ON r.per_id = pp.per_id AND r.user_id = ?
             LEFT JOIN Avaliacoes a ON a.pes_id = p.id
             WHERE 1=1 ${dateCondition} 
               AND (p.cat_pes = 'Auto Avaliação' 
                    OR (p.cat_pes IN ('Avaliação de Liderado', 'Avaliação de Líder') 
                        AND a.responsavel_id = ?))
             GROUP BY p.cat_pes`, [userId, userId, userId]);
        const categoryProgress = categoryProgressRows || [];
        // Calcular restantes por categoria
        const categories = categoryProgress.map((cat) => ({
            categoria: cat.categoria,
            total: cat.total || 0,
            answered: cat.answered || 0,
            remaining: (cat.total || 0) - (cat.answered || 0),
        }));
        // Retornar resposta
        return res.status(200).json({
            progresso: {
                total,
                answered,
                remaining,
            },
            categorias: categories.length > 0 ? categories : [], // Garante que seja um array vazio caso não haja categorias
        });
    }
    catch (error) {
        console.error('Erro ao buscar progresso da autoavaliação:', error);
        return res.status(500).json({ error: 'Erro ao buscar progresso da autoavaliação.' });
    }
};
