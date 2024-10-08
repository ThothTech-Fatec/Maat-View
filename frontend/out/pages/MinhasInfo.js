"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MinhasInfo = () => {
    const [userInfo, setUserInfo] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        // Recupera as informações do usuário do localStorage (ou de outro método de persistência)
        const storedEmail = localStorage.getItem('userEmail');
        const storedRole = localStorage.getItem('userRole');
        if (storedEmail && storedRole) {
            setUserInfo({ email: storedEmail, role: storedRole });
        }
    }, []);
    if (!userInfo) {
        return (0, jsx_runtime_1.jsx)("p", { children: "Carregando informa\u00E7\u00F5es..." }); // Exibe um loader enquanto os dados são carregados
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Minhas Informa\u00E7\u00F5es" }), (0, jsx_runtime_1.jsxs)("div", { className: "info-box", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Email:" }), " ", userInfo.email] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "N\u00EDvel de Acesso:" }), " ", userInfo.role] })] })] }));
};
exports.default = MinhasInfo;
