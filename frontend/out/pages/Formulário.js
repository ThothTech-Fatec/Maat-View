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
const react_router_dom_1 = require("react-router-dom");
const Render_Menu_1 = __importDefault(require("../components/Render_Menu"));
const FormularioPesquisa = () => {
    const { pesquisaId } = (0, react_router_dom_1.useParams)();
    const [perguntas, setPerguntas] = (0, react_1.useState)([]);
    const [respostas, setRespostas] = (0, react_1.useState)([]);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const userId = localStorage.getItem('user_Id');
    (0, react_1.useEffect)(() => {
        const fetchPerguntas = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${process.env.REACT_APP_API_URL}/api/verperguntas/${pesquisaId}`);
                setPerguntas(response.data);
                setRespostas(response.data.map((pergunta) => ({
                    per_id: pergunta.id,
                    resp_texto: pergunta.formato === 'Texto Longo' ? '' : null,
                    select_option_id: pergunta.formato === 'Escolha Única' || pergunta.formato === 'Múltipla Escolha' ? [] : null,
                })));
            }
            catch (error) {
                console.error('Erro ao buscar perguntas:', error);
            }
        });
        if (pesquisaId) {
            fetchPerguntas();
        }
    }, [pesquisaId]);
    const handleTextChange = (id, text) => {
        setRespostas(prevRespostas => prevRespostas.map(resposta => resposta.per_id === id ? Object.assign(Object.assign({}, resposta), { resp_texto: text }) : resposta));
    };
    const handleOptionChange = (id, optionId) => {
        setRespostas(prevRespostas => prevRespostas.map(resposta => {
            var _a, _b;
            if (resposta.per_id === id) {
                const isMultipleChoice = Array.isArray(resposta.select_option_id);
                if (isMultipleChoice) {
                    const optionExists = (_a = resposta.select_option_id) === null || _a === void 0 ? void 0 : _a.includes(optionId);
                    return Object.assign(Object.assign({}, resposta), { select_option_id: optionExists
                            ? ((_b = resposta.select_option_id) === null || _b === void 0 ? void 0 : _b.filter(optId => optId !== optionId)) || []
                            : [...(resposta.select_option_id || []), optionId] });
                }
                else {
                    return Object.assign(Object.assign({}, resposta), { select_option_id: [optionId] });
                }
            }
            return resposta;
        }));
    };
    const handleSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
        const allAnswered = respostas.every(resposta => resposta.resp_texto !== null || (resposta.select_option_id && resposta.select_option_id.length > 0));
        console.log(respostas);
        if (!allAnswered) {
            alert('Por favor, responda todas as perguntas.');
            return;
        }
        try {
            yield axios_1.default.post(`${process.env.REACT_APP_API_URL}/api/enviarrespostas`, { respostas, userId, pesquisaId }, { headers: { 'Content-Type': 'application/json' } });
            alert('Respostas enviadas com sucesso!');
            navigate('/minhas_avaliaçoes');
        }
        catch (error) {
            console.error('Erro ao enviar respostas:', error);
            alert('Ocorreu um erro ao enviar as respostas. Tente novamente.');
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "form-container", style: { fontFamily: 'Outfit' }, children: [(0, jsx_runtime_1.jsx)("h1", { children: "Pesquisa" }), perguntas.length > 0 ? (perguntas.map(pergunta => {
                        var _a, _b;
                        return ((0, jsx_runtime_1.jsxs)("div", { className: "pergunta", children: [(0, jsx_runtime_1.jsx)("h3", { children: pergunta.sobre }), pergunta.formato === 'Texto Longo' ? ((0, jsx_runtime_1.jsx)("textarea", { value: ((_a = respostas.find(resposta => resposta.per_id === pergunta.id)) === null || _a === void 0 ? void 0 : _a.resp_texto) || '', onChange: (e) => handleTextChange(pergunta.id, e.target.value), rows: 4 })) : ((0, jsx_runtime_1.jsx)("div", { children: (_b = pergunta.opcoes) === null || _b === void 0 ? void 0 : _b.map(opcao => {
                                        var _a, _b, _c, _d, _e;
                                        return ((0, jsx_runtime_1.jsxs)("label", { className: "option-label", style: { marginBottom: '5%' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { width: '90%' }, children: opcao.texto }), (0, jsx_runtime_1.jsx)("input", { type: pergunta.formato === 'Escolha Única' ? 'radio' : 'checkbox', name: `pergunta_${pergunta.id}`, value: opcao.id, checked: Array.isArray((_a = respostas.find(resposta => resposta.per_id === pergunta.id)) === null || _a === void 0 ? void 0 : _a.select_option_id)
                                                        ? (_c = (_b = respostas.find(resposta => resposta.per_id === pergunta.id)) === null || _b === void 0 ? void 0 : _b.select_option_id) === null || _c === void 0 ? void 0 : _c.includes(opcao.id)
                                                        : ((_e = (_d = respostas.find(resposta => resposta.per_id === pergunta.id)) === null || _d === void 0 ? void 0 : _d.select_option_id) === null || _e === void 0 ? void 0 : _e[0]) === opcao.id, onChange: () => handleOptionChange(pergunta.id, opcao.id) })] }, opcao.id));
                                    }) }))] }, pergunta.id));
                    })) : ((0, jsx_runtime_1.jsx)("p", { children: "Carregando perguntas..." })), (0, jsx_runtime_1.jsx)("button", { onClick: handleSubmit, className: 'buttonSubmitPerg', children: "Enviar Respostas" })] })] }));
};
exports.default = FormularioPesquisa;
