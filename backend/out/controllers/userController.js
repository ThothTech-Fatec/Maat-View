import bcrypt from 'bcrypt';
import pool from '../config/database.js';
pool;
// Função para cadastrar usuário
export const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, cpf, cargo, sub_cargo, liderId } = req.body;
        // Validação
        if (cargo != 'Liderado') {
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
        // Inserir o usuário no banco de dados
        await pool.query('INSERT INTO Users (nome, email, senha, cpf, cargo,sub_cargo, lider_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [nome, email, hashedPassword, cpf, cargo, sub_cargo, liderId]);
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
};
