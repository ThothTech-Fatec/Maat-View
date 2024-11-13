import bcrypt from 'bcrypt';
import pool from '../config/database.js';
// Função para cadastrar usuário
export const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, cpf, cargo, sub_cargo, liderId } = req.body;
        if (cargo !== 'Liderado') {
            if (!nome || !email || !senha || !cpf || !cargo) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }
        }
        else {
            if (!nome || !email || !senha || !cpf || !cargo || !liderId) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }
        }
        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(senha, 10);
        let query;
        let values;
        if (cargo === 'Liderado') {
            // Se o cargo for 'Liderado', ignora sub_cargo
            query = 'INSERT INTO Users (nome, email, senha, cpf, cargo, lider_id) VALUES (?, ?, ?, ?, ?, ?)';
            values = [nome, email, hashedPassword, cpf, cargo, liderId];
        }
        else {
            // Se o cargo não for 'Liderado', inclui sub_cargo
            query = sub_cargo
                ? 'INSERT INTO Users (nome, email, senha, cpf, cargo, sub_cargo, lider_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
                : 'INSERT INTO Users (nome, email, senha, cpf, cargo, lider_id) VALUES (?, ?, ?, ?, ?, ?)';
            values = sub_cargo
                ? [nome, email, hashedPassword, cpf, cargo, sub_cargo, liderId]
                : [nome, email, hashedPassword, cpf, cargo, liderId];
        }
        await pool.query(query, values);
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
};
export const AtualizarSenha = async (req, res) => {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
        return res.status(400).json({ error: 'ID do usuário e nova senha são obrigatórios.' });
    }
    try {
        // Gera o hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Atualiza a senha do usuário na tabela Users
        const [result] = await pool.execute('UPDATE Users SET senha = ? WHERE id = ?', [hashedPassword, userId]);
        // Verifica se a atualização afetou alguma linha
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.json({ message: 'Senha atualizada com sucesso.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar a senha.' });
    }
};
export const listarLiderados = async (req, res) => {
    const { userId } = req.params;
    try {
        // Consulta ao banco de dados para buscar subordinados
        const [rows] = await pool.execute(`SELECT nome, cargo, sub_cargo, email, cpf
           FROM Users
           WHERE lider_id = ?`, [userId]);
        // Retorna a lista de subordinados
        res.json(rows);
    }
    catch (error) {
        console.error("Erro ao buscar subordinados:", error);
        res.status(500).json({ error: 'Erro ao buscar subordinados.' });
    }
};
