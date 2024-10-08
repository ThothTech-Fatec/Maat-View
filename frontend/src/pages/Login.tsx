import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../static/logo.png';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro do backend:', errorData);
                throw new Error('Falha na autenticação');
            }

            const data = await response.json();
            console.log('Token recebido:', data.token);

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userRole', data.role); 

            navigate('/minhas_info');
        } catch (err) {
            setError('Erro no login.');
            console.error('Erro na requisição:', err);
        }
    };

    return (
        <body className='login-body'>
            <div className='container'>
                <div style={{marginBottom: 150}}>
                    <img src={logo} alt="Logo" style={{ display: 'block', width: '250px' }} />
                    <h1 className='outfitTitle' style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>Maat-View</h1>
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            <div className='caixatexto'>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Insira seu email.'
                                    required
                                />
                            </div>
                            <div className='caixatexto'>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Insira sua senha.'
                                    required
                                />
                            </div>
                            <button className='entrar' type="submit">Entrar</button>
                        </form>
                    </div>
                    {error && <p className="error-message" style={{ marginTop: 10 }}>{error}</p>}
                </div>
            </div>
        </body>
    );
};

export default Login;
