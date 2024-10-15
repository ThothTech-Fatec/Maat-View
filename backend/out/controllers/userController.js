import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
// Configuração de conexão com o banco de dados
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'fatec',
    database: 'maatview',
});
export const cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, password, cargo } = req.body;
        // Verifica se o usuário já existe
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Usuário já existe.' });
        }
        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insere o novo usuário no banco de dados
        await pool.query('INSERT INTO Users (nome, email, senha, cargo) VALUES (?, ?, ?, ?)', [nome, email, hashedPassword, cargo]);
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
};
