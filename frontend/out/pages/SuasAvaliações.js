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
const axios_1 = __importDefault(require("axios"));
const Render_Menu_1 = __importDefault(require("../components/Render_Menu"));
const Modal_1 = __importDefault(require("../components/Modal"));
const react_router_dom_1 = require("react-router-dom");
require("../static/SuasAvaliacoes.css");
const PesquisasPage = () => {
    const [pesquisas, setPesquisas] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [selectedPesquisa, setSelectedPesquisa] = (0, react_1.useState)(null);
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        const fetchPesquisas = () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = localStorage.getItem('user_Id');
            console.log(userId);
            if (!userId) {
                console.error("Usuário não logado.");
                setLoading(false);
                return;
            }
            try {
                const response = yield axios_1.default.get(`${process.env.REACT_APP_API_URL}/api/verpesquisas-nao-respondidas/${userId}`);
                console.log("Resposta da API:", response.data);
                // Verificando a estrutura de resposta
                if (response.data && typeof response.data === 'object' && 'autoAvaliacao' in response.data && 'avaliacoesResponsavel' in response.data) {
                    setPesquisas([...response.data.autoAvaliacao, ...response.data.avaliacoesResponsavel]);
                }
                else {
                    console.error("Formato inesperado de resposta da API.", response.data);
                }
            }
            catch (error) {
                console.error("Erro ao buscar pesquisas:", error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchPesquisas();
    }, []);
    const handlePesquisaClick = (pesquisa) => {
        setSelectedPesquisa(pesquisa);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPesquisa(null);
    };
    const handleNavigate = () => {
        if (selectedPesquisa) {
            console.log("Navegando para:", selectedPesquisa.id);
            navigate(`/pesquisa/${selectedPesquisa.id}`);
            handleCloseModal();
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsx)("div", { className: 'content-container4', style: { marginTop: '1%' }, children: (0, jsx_runtime_1.jsxs)("div", { style: { width: '100%', marginBottom: '10%' }, children: [(0, jsx_runtime_1.jsx)("h1", { children: "Pesquisas Atuais" }), loading ? ((0, jsx_runtime_1.jsx)("p", { children: "Carregando..." })) : ((0, jsx_runtime_1.jsx)("div", { children: pesquisas.length > 0 ? (pesquisas.map((pesquisa) => ((0, jsx_runtime_1.jsxs)("div", { onClick: () => handlePesquisaClick(pesquisa), className: "pesquisa-card4", style: { marginBottom: '5px' }, children: [(0, jsx_runtime_1.jsx)("h3", { children: pesquisa.titulo }), (0, jsx_runtime_1.jsxs)("p", { children: ["Categoria: ", pesquisa.cat_pes] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Sobre: ", pesquisa.sobre] })] }, pesquisa.id)))) : ((0, jsx_runtime_1.jsx)("p", { children: "Nenhuma pesquisa dispon\u00EDvel no momento." })) }))] }) }), (0, jsx_runtime_1.jsx)(Modal_1.default, { isOpen: isModalOpen, onClose: handleCloseModal, children: selectedPesquisa && ((0, jsx_runtime_1.jsxs)("div", { className: "modal-content4", children: [" ", (0, jsx_runtime_1.jsx)("h2", { children: selectedPesquisa.titulo }), (0, jsx_runtime_1.jsxs)("p", { children: ["Categoria: ", selectedPesquisa.cat_pes] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Sobre: ", selectedPesquisa.sobre] }), (0, jsx_runtime_1.jsx)("button", { className: 'buttonSubmitPerg4', onClick: handleNavigate, children: "Ir para pesquisa" })] })) })] }));
};
exports.default = PesquisasPage;
