import React, { useEffect, useState } from 'react';
import RenderMenu from '../../components/Render_Menu';

interface User {
    id: number; 
    nome: string; 
    email: string; 
    cargo: string; 
    cpf: string;
}

const ExibeUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null); // Adiciona um estado para erro

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários');
                }
                const data = await response.json();
                setUsers(data); 
            } catch (error) {
                console.error('Erro:', error);
                setError('Erro ao buscar usuários.'); // Atualiza o estado de erro
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId: number) => {
        const confirmDelete = window.confirm('Você realmente deseja apagar este usuário?');
        if (confirmDelete) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Erro ao apagar o usuário');
                }
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Erro:', error);
                setError('Erro ao apagar o usuário.'); // Atualiza o estado de erro
            }
        }
    };

    return (
        <div>
            <RenderMenu />
            <div className='content-container'>
                <div className='contentTitle'>
                    USUARIOS
                </div>
                {error && <div className='error-message'>{error}</div>} {/* Mensagem de erro */}
                <table className='userTable'>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Cargo</th>
                            <th>CPF</th> {/* Nova coluna para CPF */}
                            <th>Ações</th> {/* Adiciona uma coluna para ações */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td data-label="Nome">{user.nome}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Cargo">{user.cargo}</td>
                                <td data-label="CPF">{user.cpf}</td>
                                <td data-label="Ações">
                <button onClick={() => handleDelete(user.id)} className='deleteButton'>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExibeUser;