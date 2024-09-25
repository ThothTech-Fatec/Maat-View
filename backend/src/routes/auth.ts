import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Simulação de banco de dados para teste
const users = [
  {
    email: 'teste@exemplo.com',
    password: await bcrypt.hash('123456', 10), // Criptografando a senha uma vez
  },
];

router.post('/login', async (req: Request, res: Response) => {
    console.log('Requisição recebida:', req.body);

    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = users.find((user) => user.email === email);
    console.log('Usuário encontrado:', user);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Senha válida:', isPasswordValid); 

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Gerar um token JWT para o usuário
    const token = jwt.sign({ email: user.email }, 'secreta', { expiresIn: '1h' });

    return res.status(200).json({ message: 'Autenticação bem-sucedida!', token });
});

export default router;
