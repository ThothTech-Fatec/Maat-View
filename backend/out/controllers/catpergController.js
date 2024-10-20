import pool from '../config/database.js';
export const buscarCategorias = async (req, res) => {
    console.log('Parâmetro recebido:', req.query); // Log para verificar o parâmetro recebido
    try {
        const { query } = req.query; // Extrai o parâmetro query da requisição
        if (!query) {
            return res.status(400).json({ message: 'Parâmetro query é obrigatório.' });
        }
        const [rows] = await pool.query('SELECT categoria FROM Categoria_Perguntas WHERE categoria LIKE ?', [`${query}%`] // Modificação para buscar categorias que começam com o que foi digitado
        );
        return res.status(200).json(rows.map(row => row.categoria));
    }
    catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ message: 'Erro ao buscar categorias.' });
    }
};
// Endpoint para cadastrar nova categoria
export const cadastrarCategoria = async (req, res) => {
    try {
        const { categoria } = req.body;
        // Verificar se a categoria já existe
        const [rows] = await pool.query('SELECT id FROM Categoria_Perguntas WHERE categoria = ?', [categoria]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Categoria já existe!' });
        }
        // Inserir nova categoria
        await pool.query('INSERT INTO Categoria_Perguntas (categoria) VALUES (?)', [categoria]);
        return res.status(201).json({ message: 'Categoria cadastrada com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao cadastrar categoria:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar categoria.' });
    }
};
