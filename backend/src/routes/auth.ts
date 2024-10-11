import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise'; // Usar mysql2 com suporte a async/await

const router = express.Router();

// Configuração de conexão com o banco de dados
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'fatec',
  database: 'maatview',
});

// Rota de login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Consulta o usuário no banco de dados pelo email
    const [rows] = await pool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    const user = (rows as any)[0];
    console.log('Usuário encontrado:', user);

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Verifica se a senha informada corresponde à senha criptografada no banco
    const isPasswordValid = await bcrypt.compare(password, user.senha);
    console.log('Senha válida:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { email: user.email, role: user.cargo },
      'secreta',
      { expiresIn: '1h' }
    );

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

export default router;
