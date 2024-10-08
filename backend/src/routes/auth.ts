import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

const users = [
  {
    email: 'admin@exemplo.com',
    password: await bcrypt.hash('123456', 10),
    role: 'admin', 
  },
  {
    email: 'lider@exemplo.com',
    password: await bcrypt.hash('123456', 10),
    role: 'lider',
  },
  {
    email: 'liderado@exemplo.com',
    password: await bcrypt.hash('123456', 10),
    role: 'liderado',
  },
];

router.post('/login', async (req: Request, res: Response) => {
    console.log('Requisição recebida:', req.body);

    const { email, password } = req.body;

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

    const token = jwt.sign({ email: user.email, role: user.role }, 'secreta', { expiresIn: '1h' });

    return res.status(200).json({ 
        message: 'Autenticação bem-sucedida!', 
        token,
        email: user.email, 
        role: user.role 
    });
});

export default router;
