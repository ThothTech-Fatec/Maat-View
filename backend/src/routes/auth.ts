import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';
import cors from 'cors'; // Importando o pacote cors
import pool from '../config/database.js';

dotenv.config(); // Carrega as variáveis de ambiente

const authRoutes = express.Router();
const app = express();

app.use(cors()); // Habilita CORS
app.use(express.json()); // Para interpretar o corpo das requisições como JSON

// Rota de login
authRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Consulta o usuário no banco de dados pelo email
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        const user = (rows as any)[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Verifica se a senha informada corresponde à senha criptografada no banco
        const isPasswordValid = await bcrypt.compare(password, user.senha);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Gera o token JWT
        const token = jwt.sign({ email: user.email, role: user.cargo }, 'secreta', { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Autenticação bem-sucedida!',
            token,
            email: user.email,
            role: user.cargo,
        });
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// Rota para obter todos os usuários
authRoutes.get('/users', async (_req: Request, res: Response) => {
  try {
      const [rows] = await pool.query('SELECT id, nome, email, cargo, cpf FROM Users'); // Adicione cpf aqui
      return res.status(200).json(rows);
  } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Rota para deletar um usuário
authRoutes.delete('/users/:id', async (req: Request, res: Response) => {
  const userId = req.params.id; // Pega o ID do usuário da URL
  try {
      const [result] = await pool.query<mysql.ResultSetHeader>('DELETE FROM Users WHERE id = ?', [userId]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      return res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

export default authRoutes;
