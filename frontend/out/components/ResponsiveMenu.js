"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("../Menu.css");
const ResponsiveMenu = () => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const handleLogout = () => {
        console.log('Usuário deslogado');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `menu-container ${isOpen ? 'open' : ''}, outfitTexto`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "menu-toggle", onClick: toggleMenu, children: [(0, jsx_runtime_1.jsx)("span", { className: "menu-bar" }), (0, jsx_runtime_1.jsx)("span", { className: "menu-bar" }), (0, jsx_runtime_1.jsx)("span", { className: "menu-bar" })] }), (0, jsx_runtime_1.jsxs)("nav", { className: `menu ${isOpen ? 'active' : ''}`, children: [isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "close-menu", onClick: toggleMenu, children: "\u2190" })), (0, jsx_runtime_1.jsxs)("ul", { children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "/minhas_info", onClick: toggleMenu, children: "Minhas Informa\u00E7\u00F5es" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "/dashboard", onClick: toggleMenu, children: "Dashboard" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "/cadastro_de_user", onClick: toggleMenu, children: "Cadastro de Usu\u00E1rio" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "/cadastro_de_ask", onClick: toggleMenu, children: "Cadastro de Pergunta" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "/exibe_user", onClick: toggleMenu, children: "Exibe Usu\u00E1rios" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "/exibe_search", onClick: toggleMenu, children: "Exibe Pesquisas" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "/atualizar_senha", onClick: toggleMenu, children: "Atualizar Senha" }) })] }), (0, jsx_runtime_1.jsx)("button", { className: "logout-button", onClick: handleLogout, children: "Sair da Conta" })] })] }));
};
exports.default = ResponsiveMenu;
