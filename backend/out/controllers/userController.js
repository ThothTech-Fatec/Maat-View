import bcrypt from 'bcrypt';
import pool from '../config/database.js';
// Função para cadastrar usuário
export const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, cpf, cargo, sub_cargo, liderId } = req.body;
        // Validação
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
        // Construir a query dinamicamente
        const query = sub_cargo
            ? 'INSERT INTO Users (nome, email, senha, cpf, cargo, sub_cargo, lider_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
            : 'INSERT INTO Users (nome, email, senha, cpf, cargo, lider_id) VALUES (?, ?, ?, ?, ?, ?)';
        // Construir os valores dinamicamente
        const values = sub_cargo
            ? [nome, email, hashedPassword, cpf, cargo, sub_cargo, liderId]
            : [nome, email, hashedPassword, cpf, cargo, liderId];
        // Executar a query
        await pool.query(query, values);
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
};
