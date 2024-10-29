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
const Hoc_Admin_1 = __importDefault(require("../../hocs/Hoc_Admin"));
const Render_Menu_1 = __importDefault(require("../../components/Render_Menu"));
require("../../static/CadastroPerguntas.css");
const axios_1 = __importDefault(require("axios"));
const CadastroAsk = () => {
    const [titlePes, setTitlePes] = (0, react_1.useState)('');
    const [sobrepesq, setSobrePesq] = (0, react_1.useState)('');
    const [catpesq, setCatPesq] = (0, react_1.useState)('');
    const [catperg, setCatPerg] = (0, react_1.useState)('');
    const [sobreperg, setSobrePerg] = (0, react_1.useState)('');
    const [options, setOptions] = (0, react_1.useState)(['', '', '', '', '', '', '', '', '', '']);
    const [pergFormat, setPergFormat] = (0, react_1.useState)('');
    const [showQuestionForm, setShowQuestionForm] = (0, react_1.useState)(false);
    const [isSubmitted, setIsSubmitted] = (0, react_1.useState)(false);
    const [buttonsVisible, setButtonsVisible] = (0, react_1.useState)(true);
    const [buttonEdit, setButtonEdit] = (0, react_1.useState)(false);
    const [perguntasCadastradas, setPerguntasCadastradas] = (0, react_1.useState)([]);
    const [categoriasSugeridas, setCategoriasSugeridas] = (0, react_1.useState)([]);
    const [novaCategoriaInputVisible, setNovaCategoriaInputVisible] = (0, react_1.useState)(false);
    const [novaCategoria, setNovaCategoria] = (0, react_1.useState)('');
    // Função move para fora do useEffect
    const handleBeforeUnload = (e) => {
        if (titlePes || sobrepesq || catpesq || catperg || sobreperg || pergFormat || showQuestionForm) {
            e.preventDefault();
            e.returnValue = '';
        }
    };
    (0, react_1.useEffect)(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [titlePes, sobrepesq, catpesq, catperg, sobreperg, pergFormat, showQuestionForm]);
    (0, react_1.useEffect)(() => {
        const timeoutId = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            if (catperg.length >= 2) {
                try {
                    const response = yield axios_1.default.get(`${process.env.REACT_APP_API_URL}/api/categorias`, {
                        params: { query: catperg }
                    });
                    setCategoriasSugeridas(response.data);
                }
                catch (error) {
                    console.error('Erro ao buscar categorias:', error);
                }
            }
            else {
                setCategoriasSugeridas([]);
            }
        }), 500); // Delay de 500ms antes de realizar a busca
        return () => clearTimeout(timeoutId);
    }, [catperg]);
    const handleFormatChange = (e) => {
        setPergFormat(e.target.value);
        setCatPesq(e.target.value);
    };
    const handleClear1 = () => {
        setTitlePes('');
        setSobrePesq('');
        setCatPesq('');
        setIsSubmitted(false);
        setButtonsVisible(true);
        setButtonEdit(false);
    };
    const handleClear2 = () => {
        setSobrePerg('');
        setCatPerg('');
        setPergFormat('');
        setOptions(['', '', '', '', '', '', '', '', '', '']);
        setCategoriasSugeridas([]);
    };
    const handleSubmitPesquisa = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const pesquisas = { titlePes, sobrepesq, catpesq };
        try {
            if (titlePes && sobrepesq && catpesq) {
                const userConfirmed = window.confirm("Deseja cadastrar a Pesquisa? Não será possível realizar alterações.");
                if (userConfirmed) {
                    const response = yield axios_1.default.post(`${process.env.REACT_APP_API_URL}/api/cadastropesquisas`, pesquisas);
                    if (response.status === 201 || response.status === 200) {
                        alert('Pesquisa cadastrada com sucesso!');
                        // Remove o listener após submissão
                        window.removeEventListener('beforeunload', handleBeforeUnload);
                        handleClear2();
                        setShowQuestionForm(true);
                        setIsSubmitted(true);
                        setButtonsVisible(false);
                        setButtonEdit(true);
                    }
                }
            }
            else {
                alert('Por favor, preencha todos os campos da pesquisa.');
            }
        }
        catch (error) {
            console.error('Erro ao cadastrar/atualizar pesquisa:', error);
            alert('Erro ao cadastrar/atualizar a pesquisa. Tente novamente.');
        }
    });
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };
    const handleSubmitPergunta = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const filledOptions = options.filter(option => option.trim() !== '');
        const pergunta = {
            titlePes,
            categoriaPergunta: catperg,
            sobrePergunta: sobreperg,
            formatoPergunta: pergFormat,
            options: filledOptions.length > 0 ? filledOptions : null
        };
        try {
            const response = yield axios_1.default.post(`${process.env.REACT_APP_API_URL}/api/cadastrarpergunta`, pergunta);
            if (response.status === 201) {
                alert('Pergunta cadastrada com sucesso!');
                // Adicionar a pergunta cadastrada na lista
                setPerguntasCadastradas(prevPerguntas => [...prevPerguntas, pergunta]);
                handleClear2();
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
        }
        catch (error) {
            console.error('Erro ao cadastrar pergunta:', error);
            alert('Erro ao cadastrar a pergunta. Tente novamente.');
        }
    });
    // Função para buscar categorias conforme o usuário digita
    const handleCatPergChange = (e) => __awaiter(void 0, void 0, void 0, function* () {
        const query = e.target.value;
        setCatPerg(query);
        if (query.length >= 2) {
            try {
                const response = yield axios_1.default.get(`${process.env.REACT_APP_API_URL}/api/categorias`, {
                    params: { query }
                });
                const categorias = response.data;
                // Verifica se o valor digitado já existe na lista de categorias
                const categoriaJaExiste = categorias.some((categoria) => categoria.nome.toLowerCase() === query.toLowerCase());
                // Se não existir uma correspondência exata, exibe as sugestões
                if (!categoriaJaExiste) {
                    setCategoriasSugeridas(categorias);
                }
                else {
                    setCategoriasSugeridas([]);
                }
            }
            catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        }
        else {
            setCategoriasSugeridas([]);
        }
    });
    // Função para cadastrar nova categoria
    const handleCadastrarNovaCategoria = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (novaCategoria) {
                const response = yield axios_1.default.post(`${process.env.REACT_APP_API_URL}/api/cadastropergcategoria`, { categoria: novaCategoria });
                if (response.status === 201) {
                    alert('Categoria cadastrada com sucesso!');
                    setNovaCategoriaInputVisible(false);
                    setNovaCategoria('');
                }
            }
            else {
                setNovaCategoriaInputVisible(false);
            }
        }
        catch (error) {
            console.error('Erro ao cadastrar nova categoria:', error);
            alert('Erro ao cadastrar nova categoria.');
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: 'container3', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'Bordada3', children: [(0, jsx_runtime_1.jsx)("h2", { className: 'cadastrotitle', style: { marginLeft: "7.5%", marginTop: '3%' }, children: "Cadastro de Pesquisas" }), (0, jsx_runtime_1.jsx)("form", { className: 'form-row3', onSubmit: handleSubmitPesquisa, children: (0, jsx_runtime_1.jsxs)("div", { className: 'form-column3', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'form-group-ask', children: [(0, jsx_runtime_1.jsx)("p", { children: "T\u00EDtulo da Pesquisa:" }), (0, jsx_runtime_1.jsx)("input", { type: 'text', id: 'titlepes', name: 'titlepes', onChange: (e) => setTitlePes(e.target.value), required: true, value: titlePes, disabled: isSubmitted })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'form-group-ask', children: [(0, jsx_runtime_1.jsx)("p", { children: "Sobre a Pesquisa:" }), (0, jsx_runtime_1.jsx)("textarea", { id: 'sobrepesq', name: 'sobrepesq', onChange: (e) => setSobrePesq(e.target.value), required: true, value: sobrepesq, disabled: isSubmitted })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'form-group-ask', children: [(0, jsx_runtime_1.jsx)("p", { children: "Categoria da Pesquisa:" }), (0, jsx_runtime_1.jsxs)("select", { id: "catpesq", name: "catpesq", style: { width: '100%', marginLeft: '4%' }, onChange: (e) => setCatPesq(e.target.value), required: true, value: catpesq, disabled: isSubmitted, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, hidden: true, children: "Defina a Categoria da Pesquisa" }), (0, jsx_runtime_1.jsx)("option", { value: "Auto Avalia\u00E7\u00E3o", children: "Auto-Avalia\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)("option", { value: "Avalia\u00E7\u00E3o de Liderado", children: "Avalia\u00E7\u00E3o de Liderado" }), (0, jsx_runtime_1.jsx)("option", { value: "Avalia\u00E7\u00E3o de L\u00EDder", children: "Avalia\u00E7\u00E3o de L\u00EDder" })] }), buttonsVisible && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: 'btn-submit2', style: { margin: '4%', marginTop: '6%' }, children: "Cadastrar Pesquisa" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-clear2", onClick: handleClear1, children: "Limpar" })] }))] })] }) }), showQuestionForm && ((0, jsx_runtime_1.jsx)("form", { className: 'form-row3', onSubmit: handleSubmitPergunta, children: (0, jsx_runtime_1.jsxs)("div", { className: 'form-column3', children: [(0, jsx_runtime_1.jsx)("h2", { className: 'cadastrotitle', style: { marginTop: '10%', marginLeft: '2.5%' }, children: "Cadastro de Perguntas" }), (0, jsx_runtime_1.jsxs)("div", { className: 'form-group-ask', children: [(0, jsx_runtime_1.jsx)("p", { children: "Categoria da Pergunta:" }), (0, jsx_runtime_1.jsx)("input", { type: 'text', id: 'catperg', name: 'catperg', onChange: handleCatPergChange, required: true, value: catperg }), categoriasSugeridas.length > 0 && ((0, jsx_runtime_1.jsx)("ul", { children: categoriasSugeridas.map((categoria) => ((0, jsx_runtime_1.jsx)("li", { onClick: () => setCatPerg(categoria), children: categoria }, categoria))) })), (0, jsx_runtime_1.jsx)("button", { type: "button", className: 'btn-submit2', style: { marginTop: '4%', marginLeft: '4%', marginBottom: '2%', fontSize: '13px', padding: '5px 10px ' }, onClick: () => setNovaCategoriaInputVisible(true), children: "Adicionar nova categoria" }), novaCategoriaInputVisible && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("input", { type: 'text', id: 'catperg', value: novaCategoria, onChange: (e) => setNovaCategoria(e.target.value), placeholder: "Nova categoria" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: 'btn-submit2', style: { marginTop: '1%', marginLeft: '4%', marginBottom: '2%', fontSize: '13px', padding: '5px 10px ' }, onClick: handleCadastrarNovaCategoria, children: "Cadastrar" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: 'btn-clear2', style: { marginTop: '1%', marginLeft: '4%', marginBottom: '2%', fontSize: '13px', padding: '5px 10px ' }, onClick: () => setNovaCategoriaInputVisible(false), children: "Fechar" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: 'form-group-ask', children: [(0, jsx_runtime_1.jsx)("p", { children: "Sobre a Pergunta:" }), (0, jsx_runtime_1.jsx)("textarea", { id: 'textperg', name: 'sobreperg', onChange: (e) => setSobrePerg(e.target.value), required: true, value: sobreperg })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'form-group-ask', children: [(0, jsx_runtime_1.jsx)("p", { children: "Formato da Pergunta:" }), (0, jsx_runtime_1.jsxs)("select", { id: 'pergFormat', name: 'pergFormat', style: { width: '90%', marginLeft: '5%' }, onChange: handleFormatChange, required: true, value: pergFormat, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, hidden: true, children: "Escolha o formato da pergunta" }), (0, jsx_runtime_1.jsx)("option", { value: "Escolha \u00DAnica", children: "Escolha \u00DAnica" }), (0, jsx_runtime_1.jsx)("option", { value: "M\u00FAltipla Escolha", children: "M\u00FAltipla Escolha" }), (0, jsx_runtime_1.jsx)("option", { value: "Texto longo", children: "Texto Longo" })] })] }), (pergFormat === 'Escolha Única' || pergFormat === 'Múltipla Escolha') && ((0, jsx_runtime_1.jsxs)("div", { style: { marginLeft: '4%' }, children: [(0, jsx_runtime_1.jsx)("h3", { children: "Op\u00E7\u00F5es:" }), (0, jsx_runtime_1.jsxs)("div", { className: 'options-row', children: [(0, jsx_runtime_1.jsx)("div", { className: 'options-column', children: [...Array(5)].map((_, index) => ((0, jsx_runtime_1.jsxs)("div", { className: 'form-group-ask-options', children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Op\u00E7\u00E3o ", index + 1, ":"] }), (0, jsx_runtime_1.jsx)("textarea", { id: `option${index + 1}`, name: `option${index + 1}`, onChange: (e) => handleOptionChange(index, e.target.value), required: index < 2 })] }, index))) }), (0, jsx_runtime_1.jsx)("div", { className: 'options-column', children: [...Array(5)].map((_, index) => ((0, jsx_runtime_1.jsxs)("div", { className: 'form-group-ask-options', children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Op\u00E7\u00E3o ", index + 6, ":"] }), (0, jsx_runtime_1.jsx)("textarea", { id: `option${index + 6}`, name: `option${index + 6}`, onChange: (e) => handleOptionChange(index + 5, e.target.value) })] }, index + 5))) })] })] })), (0, jsx_runtime_1.jsx)("button", { className: 'btn-submit2', style: { marginTop: '3%', marginLeft: '2%', marginRight: '38%' }, children: "Cadastrar Pergunta" }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-clear2", onClick: handleClear2, children: "Limpar" })] }) }))] }), (0, jsx_runtime_1.jsx)("div", { className: 'Bordada3', style: { marginTop: '5%' }, children: perguntasCadastradas.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: 'form-column3', style: { width: '100%' }, children: [(0, jsx_runtime_1.jsxs)("h3", { style: { marginLeft: '4%' }, children: ["Perguntas Cadastradas na Pesquisa \"", titlePes, "\""] }), (0, jsx_runtime_1.jsxs)("table", { className: 'userTable', children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "Categoria" }), (0, jsx_runtime_1.jsx)("th", { children: "Sobre a Pergunta" }), (0, jsx_runtime_1.jsx)("th", { children: "Formato" }), (0, jsx_runtime_1.jsx)("th", { children: "Op\u00E7\u00F5es" })] }) }), perguntasCadastradas.map((pergunta, index) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { "data-label": 'Categoria', children: pergunta.categoriaPergunta }), (0, jsx_runtime_1.jsx)("td", { "data-label": 'Sobre', children: pergunta.sobrePergunta }), (0, jsx_runtime_1.jsx)("td", { "data-label": 'Formato', children: pergunta.formatoPergunta }), (0, jsx_runtime_1.jsx)("td", { "data-label": 'Op\u00E7\u00F5es', children: pergunta.options
                                                        ? pergunta.options.join(', ')
                                                        : 'N/A' })] }, index)))] })] })) })] })] }));
};
exports.default = (0, Hoc_Admin_1.default)(CadastroAsk);
