import pool from '../config/database.js';
// Função para buscar perguntas, opções e respostas relacionadas a uma pesquisa
export const getPerguntasERespostas = async (req, res) => {
    const { userId, pesquisaId } = req.params;
    try {
        console.log(`[LOG] Recebendo requisição - userId: ${userId}, pesquisaId: ${pesquisaId}`);
        const query = `
            SELECT 
                p.id AS pergunta_id,
                p.sobre AS pergunta,
                p.formato AS formato,
                o.id AS opcao_id,
                o.texto AS opcao_texto,
                r.resp_texto AS resposta_texto,
                r.select_option_id AS resposta_opcao
            FROM Pesquisas_Perguntas pp
            INNER JOIN Perguntas p ON pp.per_id = p.id
            LEFT JOIN Opções o ON o.per_id = p.id AND o.pes_id = pp.pes_id
            LEFT JOIN Respostas r 
                ON p.id = r.per_id 
                AND r.user_id = ?
                AND r.pes_id = ?
            WHERE pp.pes_id = ?;
        `;
        console.log(`[LOG] Executando consulta no banco de dados com parâmetros: ${[userId, pesquisaId, pesquisaId]}`);
        const [result] = await pool.query(query, [userId, pesquisaId, pesquisaId]);
        console.log(`[LOG] Resultado da consulta:`, result);
        const perguntas = result;
        if (perguntas.length === 0) {
            console.log(`[LOG] Nenhuma pergunta encontrada para a pesquisa: ${pesquisaId}`);
            return res.status(404).json({ message: 'Nenhuma pergunta encontrada para esta pesquisa.' });
        }
        const perguntasAgrupadas = perguntas.reduce((acc, curr) => {
            var _a;
            const { pergunta_id, pergunta, formato, opcao_id, opcao_texto, resposta_texto, resposta_opcao, } = curr;
            if (!acc[pergunta_id]) {
                acc[pergunta_id] = {
                    pergunta_id,
                    pergunta,
                    formato,
                    opcoes: [],
                    respostas: [],
                };
            }
            // Adiciona a opção, evitando duplicatas
            if (opcao_id && opcao_texto) {
                const existeOpcao = acc[pergunta_id].opcoes.some((op) => op.opcao_id === opcao_id);
                if (!existeOpcao) {
                    acc[pergunta_id].opcoes.push({ opcao_id, opcao_texto });
                }
            }
            // Adiciona a resposta, evitando duplicatas
            if (formato === 'Texto Longo' && resposta_texto) {
                if (!acc[pergunta_id].respostas.includes(resposta_texto)) {
                    acc[pergunta_id].respostas.push(resposta_texto);
                }
            }
            else if ((formato === 'Escolha Única' || formato === 'Múltipla Escolha') &&
                resposta_opcao) {
                const textoResposta = (_a = perguntas.find((p) => p.opcao_id === resposta_opcao)) === null || _a === void 0 ? void 0 : _a.opcao_texto;
                if (textoResposta && !acc[pergunta_id].respostas.includes(textoResposta)) {
                    acc[pergunta_id].respostas.push(textoResposta);
                }
            }
            return acc;
        }, {});
        const perguntasFormatadas = Object.values(perguntasAgrupadas);
        console.log(`[LOG] Perguntas formatadas:`, perguntasFormatadas);
        return res.status(200).json({ perguntas: perguntasFormatadas });
    }
    catch (error) {
        console.error('[LOG] Erro ao buscar perguntas e respostas:', error);
        return res.status(500).json({ message: 'Erro ao buscar perguntas e respostas.' });
    }
};
