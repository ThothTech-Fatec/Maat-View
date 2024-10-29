"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Render_Menu_1 = __importDefault(require("../components/Render_Menu"));
const MinhasInfo = () => {
    const [email, setEmail] = (0, react_1.useState)(null);
    const [role, setRole] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedRole = localStorage.getItem('userRole');
        if (storedEmail) {
            setEmail(storedEmail);
        }
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsx)("div", { className: 'container', children: (0, jsx_runtime_1.jsxs)("div", { className: 'Bordada outfitTexto', children: [(0, jsx_runtime_1.jsx)("h2", { style: { textAlign: 'center' }, children: "Minhas Informa\u00E7\u00F5es" }), (0, jsx_runtime_1.jsx)("textarea", { className: 'resizeTextA', readOnly: true, value: `Email: ${email || 'Não disponível'}`, rows: 1, style: {
                                width: '80%',
                                padding: '10px',
                                border: '1px solid #000',
                                borderRadius: '8px',
                                backgroundColor: '#f5f5f5',
                                resize: `none`,
                            } }), (0, jsx_runtime_1.jsx)("textarea", { className: 'resizeTextA', readOnly: true, value: `Nível de acesso: ${role || 'Não disponível'}`, rows: 1, style: {
                                width: '80%',
                                padding: '10px',
                                border: '1px solid #000',
                                borderRadius: '8px',
                                backgroundColor: '#f5f5f5',
                                resize: `none`,
                                marginTop: '5px'
                            } })] }) })] }));
};
exports.default = MinhasInfo;
