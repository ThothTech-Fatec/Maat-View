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
