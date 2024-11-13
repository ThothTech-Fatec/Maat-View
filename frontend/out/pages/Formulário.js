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
    const [respostasTemporarias, setRespostasTemporarias] = (0, react_1.useState)([]);
    const [categoria, setCategoria] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const userId = localStorage.getItem('user_Id');
    (0, react_1.useEffect)(() => {
        const fetchDados = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Buscar perguntas
                const perguntasResponse = yield axios_1.default.get(`${process.env.REACT_APP_API_URL}/api/verperguntas/${pesquisaId}`);
                setPerguntas(perguntasResponse.data);
                // Buscar respostas temporárias
                const respostasTempResponse = yield axios_1.default.get(`${process.env.REACT_APP_API_URL}/api/buscarPerguntasTemporarias/${pesquisaId}/${userId}`);
                const respostasTempData = respostasTempResponse.data.map((resposta) => (Object.assign(Object.assign({}, resposta), { resp_texto: resposta.resp_texto || '', option_text: resposta.option_text || '' })));
                setRespostasTemporarias(respostasTempData);
                // Buscar categoria da pesquisa
                const categoriaResponse = yield axios_1.default.get(`${process.env.REACT_APP_API_URL}/api/buscarcatpesq/${pesquisaId}`);
                setCategoria(categoriaResponse.data.cat_pes); // Alteração aqui, para acessar a chave correta
                console.log(categoriaResponse.data.cat_pes); // Verifique no console para garantir que está retornando o valor correto
            }
            catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        });
        fetchDados();
    }, [pesquisaId, userId]);
    (0, react_1.useEffect)(() => {
        const inicializarRespostas = perguntas.map(pergunta => {
            const respostaTemp = respostasTemporarias.find(temp => temp.per_id === pergunta.id);
            return {
                per_id: pergunta.id,
                resp_texto: (respostaTemp === null || respostaTemp === void 0 ? void 0 : respostaTemp.resp_texto) || '',
                select_option_id: (respostaTemp === null || respostaTemp === void 0 ? void 0 : respostaTemp.option_text) ? [parseInt(respostaTemp.option_text)] : []
            };
        });
        setRespostas(inicializarRespostas);
    }, [perguntas, respostasTemporarias]);
    const handleTextChange = (id, text) => {
        setRespostas(prevRespostas => prevRespostas.map(resposta => resposta.per_id === id ? Object.assign(Object.assign({}, resposta), { resp_texto: text }) : resposta));
    };
    const handleOptionChange = (id, optionId) => {
        setRespostas(prevRespostas => prevRespostas.map(resposta => {
            if (resposta.per_id === id) {
                const isMultipleChoice = Array.isArray(resposta.select_option_id);
                if (isMultipleChoice) {
                    const optionExists = resposta.select_option_id.includes(optionId);
                    return Object.assign(Object.assign({}, resposta), { select_option_id: optionExists
                            ? resposta.select_option_id.filter(optId => optId !== optionId)
                            : [...resposta.select_option_id, optionId] });
                }
                else {
                    return Object.assign(Object.assign({}, resposta), { select_option_id: [optionId] });
                }
            }
            return resposta;
        }));
    };
    const handleSubmit = () => __awaiter(void 0, void 0, void 0, function* () {
        const allAnswered = respostas.every(resposta => resposta.resp_texto !== '' || (resposta.select_option_id && resposta.select_option_id.length > 0));
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
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "form-container", style: { fontFamily: 'Outfit' }, children: [(0, jsx_runtime_1.jsx)("h1", { children: "Pesquisa" }), categoria === 'Avaliação de Liderado' && ((0, jsx_runtime_1.jsx)("div", { className: "categoria-message", children: (0, jsx_runtime_1.jsx)("p", { children: "Essa avalia\u00E7\u00E3o \u00E9 uma forma de avaliar o liderado, portanto todas as perguntas devem ser respondidas com base na sua opini\u00E3o sobre o desempenho dele." }) })), categoria === 'Avaliação de Líder' && ((0, jsx_runtime_1.jsx)("div", { className: "categoria-message", children: (0, jsx_runtime_1.jsx)("p", { children: "Essa avalia\u00E7\u00E3o \u00E9 uma forma de avaliar o l\u00EDder, portanto todas as perguntas devem ser respondidas com base na sua opini\u00E3o sobre o desempenho dele." }) })), perguntas.length > 0 ? (perguntas.map(pergunta => {
                        var _a, _b;
                        const respostaTemp = respostasTemporarias.find(temp => temp.per_id === pergunta.id);
                        return ((0, jsx_runtime_1.jsxs)("div", { className: "pergunta", children: [(0, jsx_runtime_1.jsx)("h3", { children: pergunta.sobre }), (0, jsx_runtime_1.jsx)("p", { children: respostaTemp === null || respostaTemp === void 0 ? void 0 : respostaTemp.option_text }), pergunta.formato === 'Texto Longo' ? ((0, jsx_runtime_1.jsx)("textarea", { value: ((_a = respostas.find(resposta => resposta.per_id === pergunta.id)) === null || _a === void 0 ? void 0 : _a.resp_texto) || '', onChange: (e) => handleTextChange(pergunta.id, e.target.value), rows: 4 })) : ((0, jsx_runtime_1.jsx)("div", { children: (_b = pergunta.opcoes) === null || _b === void 0 ? void 0 : _b.map(opcao => {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsxs)("label", { className: "option-label", style: { marginBottom: '5%' }, children: [(0, jsx_runtime_1.jsx)("div", { style: { width: '90%' }, children: opcao.texto }), (0, jsx_runtime_1.jsx)("input", { type: pergunta.formato === 'Escolha Única' ? 'radio' : 'checkbox', name: `pergunta_${pergunta.id}`, value: opcao.id, checked: (_a = respostas.find(resposta => resposta.per_id === pergunta.id)) === null || _a === void 0 ? void 0 : _a.select_option_id.includes(opcao.id), onChange: () => handleOptionChange(pergunta.id, opcao.id) })] }, opcao.id));
                                    }) })), respostaTemp && ((0, jsx_runtime_1.jsxs)("div", { className: "resposta-anterior", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Resposta tempor\u00E1ria anterior:" }), (0, jsx_runtime_1.jsx)("p", { children: respostaTemp.resp_texto || respostaTemp.option_text || 'Sem resposta temporária disponível' })] }))] }, pergunta.id));
                    })) : ((0, jsx_runtime_1.jsx)("p", { children: "Carregando perguntas..." })), (0, jsx_runtime_1.jsx)("button", { onClick: handleSubmit, className: "buttonSubmitPerg", children: "Enviar Respostas" })] })] }));
};
exports.default = FormularioPesquisa;
