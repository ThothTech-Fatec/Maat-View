import pool from "../config/database.js";
// Função para buscar perguntas e respostas
export const buscarPerguntasERespostasLider = async (req, res) => {
    const { userId, pesquisaId } = req.params; // Assumindo que os IDs vêm da URL da requisição (ex: /buscar/:userId/:pesquisaId)
    try {
        // Consulta para buscar o pes_id associado ao original_pes_id e responsavel_id
        const [avaliacaoRows] = await pool.execute(`
      SELECT pes_id
      FROM Avaliacoes
      WHERE original_pes_id = ? 
        AND responsavel_id = ?;
    `, [pesquisaId, userId]);
        // Verificar se uma avaliação foi encontrada
        if (avaliacaoRows.length === 0) {
            return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e pesquisa fornecidos.' });
        }
        const pes_id = avaliacaoRows[0].pes_id;
        // Consulta para buscar as perguntas e respostas baseadas no pes_id
        const [rows] = await pool.execute(`
      SELECT 
        p.sobre AS pergunta,
        r.resp_texto AS resposta,
        o.texto AS select_option_texto  -- Pegamos o texto da opção selecionada
      FROM 
        Respostas r
      JOIN 
        Perguntas p ON r.per_id = p.id
      LEFT JOIN  -- Left Join para garantir que opções nulas também sejam consideradas
        Opções o ON r.select_option_id = o.id
      WHERE 
        r.pes_id = ?;
    `, [pes_id]);
        // Agrupar respostas por pergunta e concatenar as respostas
        const resultado = [];
        // Usaremos um objeto para agrupar as respostas por pergunta
        const respostasAgrupadas = {};
        // Preencher o objeto de respostas agrupadas
        rows.forEach((row) => {
            const pergunta = row.pergunta;
            const resposta = row.select_option_texto || row.resposta || null;
            if (!respostasAgrupadas[pergunta]) {
                respostasAgrupadas[pergunta] = [];
            }
            // Se houver resposta, adiciona à lista de respostas para a pergunta
            if (resposta) {
                respostasAgrupadas[pergunta].push(resposta);
            }
        });
        // Agora preenchemos o resultado, concatenando as respostas para cada pergunta
        for (const pergunta in respostasAgrupadas) {
            const respostasConcatenadas = respostasAgrupadas[pergunta].join(', '); // Aqui as respostas são concatenadas por vírgula
            resultado.push({ pergunta, resposta: respostasConcatenadas });
        }
        // Enviar o resultado como resposta para o cliente
        return res.json(resultado);
    }
    catch (error) {
        console.error('Erro ao buscar perguntas e respostas:', error);
        return res.status(500).json({ error: 'Erro ao buscar perguntas e respostas' });
    }
};
