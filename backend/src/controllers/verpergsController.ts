import { Request, Response } from 'express';
import mysql from 'mysql2';


const db = mysql.createConnection({
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`
});


// Função para buscar perguntas por ID da pesquisa
export const buscarPerguntasPorPesquisa = (req: Request, res: Response) => {
    const { id } = req.params; // Obtém o ID da pesquisa da URL
    console.log('Buscando perguntas para a pesquisa com ID:', id); 

    // Consulta SQL para buscar perguntas, suas categorias e opções
    const query = `
        SELECT 
            Perguntas.id AS pergunta_id,
            Perguntas.sobre,
            Perguntas.formato,
            Categoria_Perguntas.categoria AS categoria,
            Opções.texto AS opcao_texto
        FROM 
            Perguntas
        JOIN 
            Pesquisas_Perguntas ON Perguntas.id = Pesquisas_Perguntas.per_id
        LEFT JOIN 
            Categoria_Perguntas ON Perguntas.cat_id = Categoria_Perguntas.id
        LEFT JOIN 
            Opções ON Opções.per_id = Perguntas.id
        WHERE 
            Pesquisas_Perguntas.pes_id = ?;
    `;

    db.query(query, [id], (error, resultados) => {
        if (error) {
            console.error('Erro ao buscar perguntas:', error);
            return res.status(500).json({ message: 'Erro ao buscar perguntas.' });
        }

        if (!Array.isArray(resultados) || resultados.length === 0) {
            return res.status(404).json({ message: 'Perguntas não encontradas.' });
        }

        // Formatar os resultados para incluir opções em um array
        const perguntasComOpcoes = resultados.reduce((acc: any, resultado: any) => {
            const { pergunta_id, sobre, formato, categoria, opcao_texto } = resultado;

            // Verifica se a pergunta já foi adicionada
            let pergunta = acc.find((p: any) => p.id === pergunta_id);

            if (!pergunta) {
                // Se não foi adicionada, cria um novo objeto para a pergunta
                pergunta = {
                    id: pergunta_id,
                    sobre,
                    formato,
                    categoria,
                    opcoes: []
                };
                acc.push(pergunta);
            }

            // Adiciona a opção, se existir
            if (opcao_texto) {
                pergunta.opcoes.push(opcao_texto);
            }

            return acc;
        }, []);

        res.status(200).json(perguntasComOpcoes);
    });
};
