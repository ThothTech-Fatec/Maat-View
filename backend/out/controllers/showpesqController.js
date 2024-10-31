import pool from '../config/database.js';
export const showPesquisas = async (req, res) => {
    const pesquisaId = req.params.id; // ID da pesquisa
    try {
        // Busca informações da pesquisa usando o ID da pesquisa
        const query = `
            SELECT r.id AS pes_id, r.titulo, r.sobre AS pesquisa_sobre, r.cat_pes
            FROM Pesquisas r
            WHERE r.id = ?`;
        const [rows] = await pool.query(query, [pesquisaId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Pesquisa não encontrada.' });
        }
        // Retorna os detalhes da pesquisa
        const pesquisa = {
            id: rows[0].pes_id,
            titulo: rows[0].titulo,
            sobre: rows[0].pesquisa_sobre,
            categoria: rows[0].cat_pes,
        };
        return res.status(200).json(pesquisa); // Retorna os detalhes da pesquisa
    }
    catch (error) {
        console.error('Erro ao buscar a pesquisa:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
};
export const VerificarPergPes = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Consulta 1: Pesquisas de Auto Avaliação não respondidas pelo usuário
        const [autoAvaliacaoResults] = await pool.query(`
      SELECT p.id, p.titulo, p.sobre, p.cat_pes
      FROM Pesquisas p
      LEFT JOIN Respostas r ON p.id = r.pes_id AND r.user_id = ?
      WHERE r.id IS NULL AND p.cat_pes = 'Auto Avaliação';
    `, [userId]);
        // Consulta 2: Pesquisas onde o usuário é o responsável pela avaliação e ainda não foram respondidas
        const [responsavelAvaliacoesResults] = await pool.query(`
      SELECT p.id, p.titulo, p.sobre, p.cat_pes
      FROM Pesquisas p
      INNER JOIN Avaliacoes a ON p.id = a.pes_id
      LEFT JOIN Respostas r ON p.id = r.pes_id AND r.user_id = ?
      WHERE a.responsavel_id = ? AND r.id IS NULL;
    `, [userId, userId]);
        // Retornando as duas listas separadas em um único objeto
        res.json({
            autoAvaliacao: autoAvaliacaoResults,
            avaliacoesResponsavel: responsavelAvaliacoesResults
        });
    }
    catch (error) {
        console.error("Erro ao buscar pesquisas e avaliações:", error);
        res.status(500).send("Erro ao buscar pesquisas e avaliações.");
    }
};
