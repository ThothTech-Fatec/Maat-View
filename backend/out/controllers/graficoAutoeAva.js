import pool from '../config/database.js';
export const getAutoavaliacoesRespondidas = async (req, res) => {
    var _a, _b;
    const { userId } = req.params;
    const { startDate, endDate, dateFilter } = req.query; // Incluído o filtro de data
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
        // Validar os parâmetros de data (opcional)
        if (startDate && isNaN(Date.parse(startDate))) {
            return res.status(400).json({ error: 'Data de início inválida.' });
        }
        if (endDate && isNaN(Date.parse(endDate))) {
            return res.status(400).json({ error: 'Data de término inválida.' });
        }
        // Buscar autoavaliações respondidas diretamente pelo usuário
        const [autoavaliacoesRespondidasRows] = await pool.execute(`
            SELECT COUNT(DISTINCT r.pes_id) AS autoavaliacoes_respondidas
            FROM Respostas r
            JOIN Pesquisas p ON r.pes_id = p.id
            WHERE r.user_id = ?
              AND p.cat_pes = 'Auto Avaliação'
              ${startDate ? 'AND r.data_resposta >= ?' : ''}
              ${endDate ? 'AND r.data_resposta <= ?' : ''}
              ${dateCondition}
            `, [
            userId,
            ...(startDate ? [startDate] : []),
            ...(endDate ? [endDate] : []),
        ]);
        const autoavaliacoesRespondidas = ((_a = autoavaliacoesRespondidasRows[0]) === null || _a === void 0 ? void 0 : _a.autoavaliacoes_respondidas) || 0;
        console.log("Autoavaliações Respondidas:", autoavaliacoesRespondidas);
        // Buscar as pesquisas do tipo "Avaliação de Líder" e "Avaliação de Liderado"
        const [avaliacoesRows] = await pool.execute(`
            SELECT DISTINCT p.id
            FROM Pesquisas p
            WHERE p.cat_pes IN ('Avaliação de Líder', 'Avaliação de Liderado')
            `);
        const pesquisaIds = avaliacoesRows.map(p => p.id);
        console.log("IDs das Avaliações:", pesquisaIds);
        if (pesquisaIds.length === 0) {
            return res.status(200).json({
                autoavaliacoesRespondidas,
                avaliacoesRespondidas: 0,
            });
        }
        // Buscar avaliações respondidas nas pesquisas de "Avaliação de Líder" e "Avaliação de Liderado"
        const [avaliacoesRespondidasRows] = await pool.execute(`
            SELECT COUNT(DISTINCT r.pes_id) AS avaliacoes_respondidas
            FROM Respostas r
            JOIN Pesquisas p ON r.pes_id = p.id
            WHERE r.user_id = ?
              AND p.cat_pes IN ('Avaliação de Líder', 'Avaliação de Liderado')
              ${startDate ? 'AND r.data_resposta >= ?' : ''}
              ${endDate ? 'AND r.data_resposta <= ?' : ''}
              ${dateCondition}
            `, [
            userId,
            ...(startDate ? [startDate] : []),
            ...(endDate ? [endDate] : []),
        ]);
        const avaliacoesRespondidas = ((_b = avaliacoesRespondidasRows[0]) === null || _b === void 0 ? void 0 : _b.avaliacoes_respondidas) || 0;
        // Retornar as avaliações respondidas
        return res.status(200).json({
            autoavaliacoesRespondidas,
            avaliacoesRespondidas,
        });
    }
    catch (error) {
        console.error('Erro ao buscar avaliações respondidas:', error);
        return res.status(500).json({ error: 'Erro ao buscar avaliações respondidas.' });
    }
};
