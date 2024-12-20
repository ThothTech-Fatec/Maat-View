import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from '../config/database.js';
dotenv.config();
const authRoutes = express.Router();
const app = express();
app.use(cors());
app.use(express.json());
// Rota de login
authRoutes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query('SELECT id, nome, email, cargo, sub_cargo, cpf, senha FROM Users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.senha);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
        // Gera o token JWT
        const token = jwt.sign({ nome: user.nome, cpf: user.cpf, email: user.email, role: user.cargo, id: user.id }, 'secreta', { expiresIn: '1h' });
        console.log('Usuário autenticado:', user);
        return res.status(200).json({
            message: 'Autenticação bem-sucedida!',
            token,
            id: user.id,
            nome: user.nome,
            cpf: user.cpf,
            email: user.email,
            role: user.cargo,
        });
    }
    catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
});
// Rota para obter todos os usuários
authRoutes.get('/users', async (_req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nome, email, cargo, COALESCE(sub_cargo, '') as sub_cargo, cpf FROM Users");
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
});
// Rota para deletar um usuário
authRoutes.delete('/users/:id', async (req, res) => {
    const userId = req.params.id; // Pega o ID do usuário da URL
    try {
        const [result] = await pool.query('DELETE FROM Users WHERE id = ?', [userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        return res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    }
    catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
});
authRoutes.get('/pesquisas', async (_req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT id, titulo, DATE_FORMAT(data_criacao, '%Y-%m-%d') AS data_criacao_formatada, sobre, cat_pes 
        FROM Pesquisas
      `);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error('Erro ao buscar pesquisas:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
});
authRoutes.delete('/pesquisas/:id', async (req, res) => {
    const pes_id = req.params.id;
    const connection = await pool.getConnection();
    try {
        // Inicia uma transação
        await connection.beginTransaction();
        // Deleta registros dependentes em ordem reversa
        await connection.query('DELETE FROM Temp_Respostas WHERE ava_id IN (SELECT id FROM Avaliacoes WHERE pes_id = ?)', [pes_id]);
        await connection.query('DELETE FROM Respostas WHERE pes_id = ?', [pes_id]);
        await connection.query('DELETE FROM Opções WHERE pes_id = ?', [pes_id]);
        await connection.query('DELETE FROM Pesquisas_Perguntas WHERE pes_id = ?', [pes_id]);
        await connection.query('DELETE FROM Avaliacoes WHERE pes_id = ?', [pes_id]);
        // Deleta a pesquisa
        const [result] = await connection.query('DELETE FROM Pesquisas WHERE id = ?', [pes_id]);
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Pesquisa não encontrada.' });
        }
        // Confirma a transação
        await connection.commit();
        return res.status(200).json({ message: 'Pesquisa deletada com sucesso.' });
    }
    catch (error) {
        await connection.rollback();
        console.error('Erro ao deletar pesquisa:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
    finally {
        connection.release();
    }
});
// Rota para buscar apenas os líderes
authRoutes.get('/lideres', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nome FROM Users WHERE cargo = ?', ['Líder']);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error('Erro ao buscar líderes:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
});
export default authRoutes;
