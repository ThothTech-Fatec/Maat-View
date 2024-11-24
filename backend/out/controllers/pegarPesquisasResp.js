import pool from '../config/database.js'; // Aqui você importa sua conexão com o banco de dados.
// Função para pegar todas as pesquisas de autoavaliação respondidas por um usuário
const getPesquisasRespondidas = async (req, res) => {
    const userId = parseInt(req.params.userId); // Obtém o ID do usuário
    const dateFilter = req.query.dateFilter || 'all'; // Filtro de data (sem filtro será 'all')
    try {
        // Montando a query com base no filtro de data
        let query = `
      SELECT DISTINCT p.id, p.titulo, p.sobre, p.cat_pes
      FROM Pesquisas p
      JOIN Respostas r ON p.id = r.pes_id
      WHERE r.user_id = ?
    `;
        // Filtrando por data se necessário
        if (dateFilter === 'week') {
            query += " AND p.data_criacao >= CURDATE() - INTERVAL 1 WEEK";
        }
        else if (dateFilter === 'month') {
            query += " AND p.data_criacao >= CURDATE() - INTERVAL 1 MONTH";
        }
        else if (dateFilter === 'year') {
            query += " AND p.data_criacao >= CURDATE() - INTERVAL 1 YEAR";
        }
        // Executando a query
        const [rows, fields] = await pool.query(query, [userId]);
        // Verificando se houve resultados
        if (Array.isArray(rows) && rows.length === 0) {
            return res.status(404).json({ message: 'Nenhuma pesquisa encontrada.' });
        }
        // Logando os resultados para verificação
        console.log('Pesquisas Respondidas:', rows);
        // Respondendo com os dados
        return res.json({ pesquisas: rows });
    }
    catch (error) {
        console.error('Erro ao buscar pesquisas respondidas:', error);
        return res.status(500).json({ message: 'Erro ao buscar pesquisas respondidas.' });
    }
};
export default getPesquisasRespondidas;
