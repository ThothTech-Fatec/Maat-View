import React, { useEffect, useState } from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';


interface User {
    nome: string;
    email: string;
    cargo: string;
}

const ExibeUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

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
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <RenderMenu />
            <div className='content-container'>
                <div className='contentTitle'>
                    USUARIOS
                </div>
                <table className='userTable'>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Cargo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.nome}</td>
                                <td>{user.email}</td>
                                <td>{user.cargo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExibeUser;
