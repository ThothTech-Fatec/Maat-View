import React, { useEffect, useState } from 'react';
import RenderMenu from '../../components/Render_Menu';
import LiderRole from '../../hocs/Hoc_Lider';

interface User {
    id: number; 
    nome: string; 
    email: string; 
    sub_cargo: string;
    cargo: string; 
    cpf: string;
}

const ExibirLiderados: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('user_Id');

        const fetchLiderados = async () => {
            if (!userId) {
                setError('ID do usuário não encontrado.');
                return;
            }
        
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/listarliderados/${userId}`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar subordinados');
                }
                const data = await response.json();
                setUsers(data); 
            } catch (error) {
                console.error('Erro:', error);
                setError('Erro ao buscar subordinados.');
            }
        };
        
        fetchLiderados()
    }, []);
    
    return (
        <div>
            <RenderMenu />
            <div className='content-container'>
                <div className='contentTitle'>
                    USUÁRIOS
                </div>
                {error && <div className='error-message'>{error}</div>} 
                <table className='userTable'>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Cargo</th>
                            <th>CPF</th> 
                        </tr>
                    </thead>

                        {users.map((user) => (
                            <tr key={user.id}>
                                <td data-label="Nome">{user.nome}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Cargo">
                                    {user.sub_cargo === 'Liderado' ? `${user.cargo}, ${user.sub_cargo}` : user.cargo}
                                </td>
                                <td data-label="CPF">{user.cpf}</td>
                            </tr>
                        ))}
                 
                </table>
            </div>
        </div>
    );
};

export default LiderRole(ExibirLiderados);
