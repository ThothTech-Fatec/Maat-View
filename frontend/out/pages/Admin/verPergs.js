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
const react_router_dom_1 = require("react-router-dom");
const Render_Menu_1 = __importDefault(require("../../components/Render_Menu"));
const Hoc_Admin_1 = __importDefault(require("../../hocs/Hoc_Admin"));
const VerPergs = () => {
    const { id } = (0, react_router_dom_1.useParams)(); // Obtém o ID da pesquisa da URL
    const [perguntas, setPerguntas] = (0, react_1.useState)([]);
    const [pesquisas, setPesquisas] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [pergunta, setPergunta] = (0, react_1.useState)(null);
    // Busca as perguntas
    (0, react_1.useEffect)(() => {
        const fetchPerguntas = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const url = `${process.env.REACT_APP_API_URL}/api/pesquisas/${id}/perguntas`;
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar perguntas: ${response.status} ${response.statusText}`);
                }
                const data = yield response.json();
                setPerguntas(data);
            }
            catch (error) {
                console.error('Erro:', error);
            }
        });
        fetchPerguntas();
    }, [id]);
    // Busca as informações da pesquisa
    (0, react_1.useEffect)(() => {
        const fetchPesquisa = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!id)
                return; // Verifica se o ID está disponível
            try {
                const url = `${process.env.REACT_APP_API_URL}/api/perguntas/${id}`;
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar pesquisa: ${response.status} ${response.statusText}`);
                }
                const data = yield response.json();
                setPesquisas(data); // Armazena as informações da pesquisa
            }
            catch (error) {
                console.error('Erro:', error);
                setError('Erro ao buscar pesquisa.');
            }
        });
        fetchPesquisa();
    }, [id]);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: 'content-container', style: { marginTop: '5%' }, children: [(0, jsx_runtime_1.jsx)("h1", { style: { fontFamily: 'Outfit' }, children: "Detalhes da Pesquisa" }), pesquisas ? ((0, jsx_runtime_1.jsxs)("table", { className: 'userTable', children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "T\u00EDtulo" }), (0, jsx_runtime_1.jsx)("th", { children: "Descri\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)("th", { children: "Categoria" })] }) }), (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { "data-label": "T\u00EDtulo", children: pesquisas.titulo }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Sobre", children: pesquisas.sobre }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Categoria", children: pesquisas.categoria })] }, pesquisas.id)] })) : ((0, jsx_runtime_1.jsx)("div", { children: "Carregando informa\u00E7\u00F5es da pesquisa..." })), (0, jsx_runtime_1.jsxs)("h2", { style: { fontFamily: 'Outfit', marginTop: '20px' }, children: ["Perguntas Cadastradas na Pesquisa: ", pesquisas === null || pesquisas === void 0 ? void 0 : pesquisas.titulo] }), error && (0, jsx_runtime_1.jsx)("div", { className: 'error-message', children: error }), perguntas.length > 0 ? ((0, jsx_runtime_1.jsxs)("table", { className: 'userTable', children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Sobre" }), (0, jsx_runtime_1.jsx)("th", { children: "Formato" }), (0, jsx_runtime_1.jsx)("th", { children: "Categoria" }), (0, jsx_runtime_1.jsx)("th", { children: "Op\u00E7\u00F5es" })] }) }), perguntas.map(pergunta => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { "data-label": "Sobre", children: pergunta.sobre }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Formato", children: pergunta.formato }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Categoria", children: pergunta.categoria }), (0, jsx_runtime_1.jsx)("td", { "data-label": "Op\u00E7\u00F5es", children: pergunta.opcoes.length > 0 ? ((0, jsx_runtime_1.jsx)("ul", { children: pergunta.opcoes.map((opcao, index) => ((0, jsx_runtime_1.jsx)("li", { children: opcao }, index))) })) : ((0, jsx_runtime_1.jsx)("span", { children: "Nenhuma op\u00E7\u00E3o dispon\u00EDvel" })) })] }, pergunta.id)))] })) : ((0, jsx_runtime_1.jsx)("div", { children: "Nenhuma pergunta encontrada." }))] })] }));
};
exports.default = (0, Hoc_Admin_1.default)(VerPergs);
