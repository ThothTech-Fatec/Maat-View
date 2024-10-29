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
const react_router_dom_1 = require("react-router-dom"); // Importa Link do React Router
const Render_Menu_1 = __importDefault(require("../../components/Render_Menu"));
require("../../static/ExibePesq.css");
const Hoc_Admin_1 = __importDefault(require("../../hocs/Hoc_Admin"));
const ExibePesq = () => {
    const [pesquisas, setPesquisas] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchPesquisas = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${process.env.REACT_APP_API_URL}/api/pesquisas`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar pesquisas');
                }
                const data = yield response.json();
                setPesquisas(data);
            }
            catch (error) {
                console.error('Erro:', error);
                setError('Erro ao buscar pesquisas.');
            }
        });
        fetchPesquisas();
    }, []);
    const handleDelete = (pes_id) => __awaiter(void 0, void 0, void 0, function* () {
        const confirmDelete = window.confirm('Você realmente deseja apagar esta pesquisa?');
        if (confirmDelete) {
            try {
                const response = yield fetch(`${process.env.REACT_APP_API_URL}/api/pesquisas/${pes_id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Erro ao apagar a pesquisa');
                }
                setPesquisas(pesquisas.filter(pesquisas => pesquisas.id !== pes_id));
            }
            catch (error) {
                console.error('Erro:', error);
                setError('Erro ao apagar a pesquisa.');
            }
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: 'content-container', children: [(0, jsx_runtime_1.jsx)("div", { className: 'contentTitle', children: "PESQUISAS" }), error && (0, jsx_runtime_1.jsx)("div", { className: 'error-message', children: error }), (0, jsx_runtime_1.jsxs)("table", { className: 'userTable', children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "T\u00EDtulo" }), (0, jsx_runtime_1.jsx)("th", { children: "Sobre" }), (0, jsx_runtime_1.jsx)("th", { children: "Categoria" }), (0, jsx_runtime_1.jsx)("th", { children: "Exibir" }), (0, jsx_runtime_1.jsx)("th", { children: "A\u00E7\u00F5es" })] }) }), pesquisas.map((pesquisas) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { "data-label": "T\u00EDtulo", children: pesquisas.titulo }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Sobre", children: pesquisas.sobre }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Categoria", children: pesquisas.cat_pes }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Exibir", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: `/ver-Pergs/${pesquisas.id}`, children: (0, jsx_runtime_1.jsx)("button", { className: "verButton", children: "Ver" }) }) }), (0, jsx_runtime_1.jsx)("td", { "data-label": "A\u00E7\u00F5es", children: (0, jsx_runtime_1.jsx)("button", { className: 'deleteButton2', onClick: () => handleDelete(pesquisas.id), children: "Excluir" }) })] }, pesquisas.id)))] })] })] }));
};
exports.default = (0, Hoc_Admin_1.default)(ExibePesq);
