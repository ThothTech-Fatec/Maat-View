import pool from '../config/database.js';
export const buscarPerguntasTemporarias = async (req, res) => {
    try {
        const pesquisaId = parseInt(req.params.pesquisaId);
        const userId = parseInt(req.params.userId);
        // Etapa 1: Verificar o ID da avaliação com base na pesquisa e no usuário
        const [avaliacaoResult] = await pool.query(`
      SELECT id FROM Avaliacoes WHERE pes_id = ? AND responsavel_id = ?
    `, [pesquisaId, userId]);
        if (avaliacaoResult.length === 0) {
            return res.status(404).json({ error: 'Avaliação não encontrada para a pesquisa e usuário especificados.' });
        }
        const avaliacaoId = avaliacaoResult[0].id;
        // Etapa 2: Buscar respostas temporárias associadas ao ID da avaliação e incluir o texto da opção, substituindo null por string vazia
        const [perguntasTemporarias] = await pool.query(`
      SELECT 
        IFNULL(tr.resp_texto, '') AS resp_texto, 
        IFNULL(op.texto, '') AS option_text 
      FROM 
        Temp_Respostas tr
      LEFT JOIN 
        Opções op ON tr.select_option_id = op.id
      WHERE 
        tr.ava_id = ? AND tr.user_id = ?
    `, [avaliacaoId, userId]);
        res.json(perguntasTemporarias);
    }
    catch (error) {
        console.error('Erro ao buscar perguntas temporárias:', error);
        res.status(500).json({ error: 'Erro ao buscar perguntas temporárias' });
    }
};
// Função para buscar a categoria da pesquisa com base no pesquisaId
export const buscarCategoriaPesquisa = async (req, res) => {
    try {
        const pesquisaId = parseInt(req.params.pesquisaId);
        const [categoriaResult] = await pool.query(`
      SELECT cat_pes FROM Pesquisas WHERE id = ?
    `, [pesquisaId]);
        if (categoriaResult.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada para a pesquisa especificada.' });
        }
        const categoria = categoriaResult;
        res.json({ categoria });
    }
    catch (error) {
        console.error('Erro ao buscar a categoria da pesquisa:', error);
        res.status(500).json({ error: 'Erro ao buscar a categoria da pesquisa' });
    }
};
