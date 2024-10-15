import React, { useState } from 'react';
import '../static/Menu.css';

const LideradoResponsiveMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        console.log('Usuário deslogado');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    return (
        <div className={`menu-container ${isOpen ? 'open' : ''}, outfitTexto`}>
            <div className="menu-toggle" onClick={toggleMenu}>
                <span className="menu-bar"></span>
                <span className="menu-bar"></span>
                <span className="menu-bar"></span>
            </div>

            <nav className={`menu ${isOpen ? 'active' : ''}`}>
                {isOpen && (
                    <div className="close-menu" onClick={toggleMenu}>
                        &larr;
                    </div>
                )}
                <ul>
                    <li><a href="/minhas_info" onClick={toggleMenu}>Minhas Informações</a></li>
                    <li><a href="/dashboard" onClick={toggleMenu}>Dashboard</a></li>
                    <li><a href="/minhas_avaliaçoes" onClick={toggleMenu}>Suas Avaliações</a></li>
                    <li><a href="/exibe_search" onClick={toggleMenu}>Exibe Pesquisas</a></li>
                    <li><a href="/atualizar_senha" onClick={toggleMenu}>Atualizar Senha</a></li>
                </ul>
                <button className="logout-button" onClick={handleLogout}> 
                    Sair da Conta
                </button>
            </nav>
        </div>
    );
};

export default LideradoResponsiveMenu;
