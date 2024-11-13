import React, { useEffect, useState } from 'react';
import AdminResponsiveMenu from '../components/ADMResponsiveMenu'; 
import LideradoResponsiveMenu from '../components/LIDERADOResponsiveMenu';
import LiderResponsiveMenu from '../components/LIDERResponsiveMenu';
import RenderMenu from '../components/Render_Menu';
import Modal from '../components/Modal';
import axios from 'axios';

const MinhasInfo: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [nome, setNome] = useState<string | null>(null);
    const [cpf, setCpf] = useState<string | null>(null);
    const [id, setID] = useState<string | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedRole = localStorage.getItem('userRole');
        const storedNome = localStorage.getItem('nomeUser');
        const storedCpf = localStorage.getItem('cpfUser');
        const storedUserId = localStorage.getItem('user_Id');

        if (storedEmail) setEmail(storedEmail);
        if (storedRole) setRole(storedRole);
        if (storedNome) setNome(storedNome);
        if (storedCpf) setCpf(storedCpf);
        if (storedUserId) setID(storedUserId);
        

    }, []);

    const openPasswordModal = () => setIsPasswordModalOpen(true);
    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
    };

    // Função para atualizar a senha
    const atualizarSenha = async (novaSenha: string, confirmarSenha: string) => {
        if (novaSenha === confirmarSenha) {
            try {
                const userConfirmed = window.confirm(
                    `Confirma a troca da senha de sua conta? Sr(a) ${nome} `
                );

                if (userConfirmed) {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/atualizarsenha`, {
                        userId: id,
                        newPassword: novaSenha
                    });

                    if (response.status === 201 || response.status === 200) {
                        alert('Senha Trocada com sucesso!');

                        // Remove o listener após submissão
                        console.log('Senha trocada com sucesso!');
                        closePasswordModal();
                        setNewPassword('');
                        setConfirmPassword('');
                    }
                }
            } catch (error) {
                console.error('Erro ao trocar a senha:', error);
                alert('Erro ao trocar a senha.');
            }
        } else {
            alert('As senhas não coincidem.');
        }
    };

    const handlePasswordChange = () => atualizarSenha(newPassword, confirmPassword);

    // Função para formatar o CPF
    const formatarCPF = (cpf: string | null | undefined): string => {
        if (!cpf || cpf.length !== 14) return 'Não disponível'; // Verifica se o CPF é válido
        return `${cpf.slice(0, 3)}.***.*${cpf.slice(9, 11)}-${cpf.slice(12)}`;
    };

    return (
        <div>
            <RenderMenu />
            <div className='content-container' style={{ height: 'auto' }}>
                <div className='pesquisa-card4' style={{ marginLeft: '12%', marginRight: '20%', width: '350px', marginTop: '200px' }}>
                    <h2 style={{ textAlign: 'center' }}>Minhas Informações</h2>
                    <h3 style={{ textAlign: 'center', marginBottom: '-2%' }}>Email: {email || 'Não disponível'}</h3>
                    <h3 style={{ textAlign: 'center', marginBottom: '-2%' }}>Nome: {nome || 'Não disponível'}</h3>
                    <h3 style={{ textAlign: 'center', marginBottom: '-2%' }}>Cpf: {formatarCPF(cpf) || 'Não disponível'}</h3>
                    <h3 style={{ textAlign: 'center' }}>Nível de acesso: {role || 'Não disponível'}</h3>

                    <button onClick={openPasswordModal} className='buttonSubmitPerg4' style={{ marginTop: '10px', marginLeft: '30%', width: '40%' }}>
                        Trocar Senha
                    </button>
                </div>
            </div>
            <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal}>
                <div className="modal-content4">
                    <h2>Trocar Senha</h2>
                    <input
                        type="password"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ display: 'block', margin: '10px 0', padding: '8px', width: '90%' }}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ display: 'block', margin: '10px 0', padding: '8px', width: '90%' }}
                    />
                    <button
                        onClick={handlePasswordChange}
                        className='buttonSubmitPerg4'
                        style={{ marginTop: '10px' }}
                    >
                        Confirmar
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default MinhasInfo;
