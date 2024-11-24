import React, { useState } from 'react';
import '../static/Menu.css';

const LiderResponsiveMenu: React.FC = () => {
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
                    <li><a href="/dashboardld" onClick={toggleMenu}>Dashboard</a></li>
                    <li><a href="/minhas_avaliaçoes" onClick={toggleMenu}>Suas Avaliações</a></li>
                    <li><a href="/exibir_liderados" onClick={toggleMenu}>Exibe Liderados</a></li>
                </ul>
                <button className="logout-button" onClick={handleLogout}> 
                    Sair da Conta
                </button>
            </nav>
        </div>
    );
};

export default LiderResponsiveMenu;
