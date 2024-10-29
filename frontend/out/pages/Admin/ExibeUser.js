"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Render_Menu_1 = __importDefault(require("../../components/Render_Menu"));
const Hoc_Admin_1 = __importDefault(require("../../hocs/Hoc_Admin"));
const ExibeUser = () => {
    const [users, setUsers] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchUsers = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${process.env.REACT_APP_API_URL}/api/users`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários');
                }
                const data = yield response.json();
                setUsers(data);
            }
            catch (error) {
                console.error('Erro:', error);
                setError('Erro ao buscar usuários.');
            }
        });
        fetchUsers();
    }, []);
    const handleDelete = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const confirmDelete = window.confirm('Você realmente deseja apagar este usuário?');
        if (confirmDelete) {
            try {
                const response = yield fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Erro ao apagar o usuário');
                }
                setUsers(users.filter(user => user.id !== userId));
            }
            catch (error) {
                console.error('Erro:', error);
                setError('Erro ao apagar o usuário.');
            }
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: 'content-container', children: [(0, jsx_runtime_1.jsx)("div", { className: 'contentTitle', children: "USUARIOS" }), error && (0, jsx_runtime_1.jsx)("div", { className: 'error-message', children: error }), (0, jsx_runtime_1.jsxs)("table", { className: 'userTable', children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Nome" }), (0, jsx_runtime_1.jsx)("th", { children: "Email" }), (0, jsx_runtime_1.jsx)("th", { children: "Cargo" }), (0, jsx_runtime_1.jsx)("th", { children: "CPF" }), (0, jsx_runtime_1.jsx)("th", { children: "A\u00E7\u00F5es" })] }) }), users.map((user) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { "data-label": "Nome", children: user.nome }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Email", children: user.email }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Cargo", children: user.sub_cargo ? `${user.cargo}, ${user.sub_cargo}` : user.cargo }), (0, jsx_runtime_1.jsx)("td", { "data-label": "CPF", children: user.cpf }), (0, jsx_runtime_1.jsx)("td", { "data-label": "A\u00E7\u00F5es", children: user.cargo !== 'Admin' ? ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleDelete(user.id), className: 'deleteButton', children: "Excluir" })) : ((0, jsx_runtime_1.jsx)("p", { style: { marginLeft: '2%' }, children: "X" })) })] }, user.id)))] })] })] }));
};
exports.default = (0, Hoc_Admin_1.default)(ExibeUser);
