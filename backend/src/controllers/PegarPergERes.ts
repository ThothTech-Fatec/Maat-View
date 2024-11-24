import { Request, Response } from 'express';
import pool from '../config/database.js';

// Função para buscar perguntas, opções e respostas relacionadas a uma pesquisa
export const getPerguntasERespostas = async (req: Request, res: Response) => {
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

        const perguntas = result as {
            pergunta_id: number;
            pergunta: string;
            formato: string;
            opcao_id: number | null;
            opcao_texto: string | null;
            resposta_texto: string | null;
            resposta_opcao: number | null;
        }[];

        if (perguntas.length === 0) {
            console.log(`[LOG] Nenhuma pergunta encontrada para a pesquisa: ${pesquisaId}`);
            return res.status(404).json({ message: 'Nenhuma pergunta encontrada para esta pesquisa.' });
        }

        const perguntasAgrupadas = perguntas.reduce((acc, curr) => {
            const {
                pergunta_id,
                pergunta,
                formato,
                opcao_id,
                opcao_texto,
                resposta_texto,
                resposta_opcao,
            } = curr;

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
                const existeOpcao = acc[pergunta_id].opcoes.some(
                    (op: { opcao_id: number; opcao_texto: string }) => op.opcao_id === opcao_id
                );
                if (!existeOpcao) {
                    acc[pergunta_id].opcoes.push({ opcao_id, opcao_texto });
                }
            }

            // Adiciona a resposta, evitando duplicatas
            if (formato === 'Texto Longo' && resposta_texto) {
                if (!acc[pergunta_id].respostas.includes(resposta_texto)) {
                    acc[pergunta_id].respostas.push(resposta_texto);
                }
            } else if (
                (formato === 'Escolha Única' || formato === 'Múltipla Escolha') &&
                resposta_opcao
            ) {
                const textoResposta = perguntas.find(
                    (p) => p.opcao_id === resposta_opcao
                )?.opcao_texto;

                if (textoResposta && !acc[pergunta_id].respostas.includes(textoResposta)) {
                    acc[pergunta_id].respostas.push(textoResposta);
                }
            }

            return acc;
        }, {} as Record<number, any>);

        const perguntasFormatadas = Object.values(perguntasAgrupadas);

        console.log(`[LOG] Perguntas formatadas:`, perguntasFormatadas);

        return res.status(200).json({ perguntas: perguntasFormatadas });
    } catch (error) {
        console.error('[LOG] Erro ao buscar perguntas e respostas:', error);
        return res.status(500).json({ message: 'Erro ao buscar perguntas e respostas.' });
    }
};
