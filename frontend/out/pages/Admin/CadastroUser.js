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
const Render_Menu_1 = __importDefault(require("../../components/Render_Menu"));
require("../../static/CadastroUsuario.css");
const Hoc_Admin_1 = __importDefault(require("../../hocs/Hoc_Admin"));
const CadastroUsuario = () => {
    const [nome, setNome] = (0, react_1.useState)('');
    const [cpf, setCpf] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [senha, setSenha] = (0, react_1.useState)('');
    const [confirmaSenha, setConfirmaSenha] = (0, react_1.useState)('');
    const [nivelAcesso, setNivelAcesso] = (0, react_1.useState)('');
    const [subCargo, setSubCargo] = (0, react_1.useState)('');
    const [lider, setLider] = (0, react_1.useState)('');
    const [lideres, setLideres] = (0, react_1.useState)([]);
    // Formatar CPF
    const formatCpf = (value) => {
        const onlyDigits = value.replace(/\D/g, '');
        if (onlyDigits.length <= 11) {
            return onlyDigits
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return value;
    };
    const handleCpfChange = (e) => {
        const formattedValue = formatCpf(e.target.value);
        if (formattedValue.length <= 14) {
            setCpf(formattedValue);
        }
    };
    (0, react_1.useEffect)(() => {
        if (nivelAcesso === 'Liderado' || (nivelAcesso === 'Líder' && subCargo === 'Liderado')) {
            // Buscar todos os líderes da API quando o cargo selecionado for "Liderado" ou "Líder" com subcargo "Liderado"
            axios_1.default.get(`${process.env.REACT_APP_API_URL}/api/lideres`)
                .then(response => setLideres(response.data))
                .catch(error => console.error("Erro ao buscar líderes:", error));
        }
    }, [nivelAcesso, subCargo]);
    // Função para enviar o formulário
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (senha !== confirmaSenha) {
            alert("As senhas não coincidem!");
            return;
        }
        const usuario = {
            nome,
            cpf,
            email,
            senha,
            cargo: nivelAcesso,
            sub_cargo: subCargo === 'Nulo' ? null : subCargo,
            liderId: nivelAcesso === 'Liderado' || (nivelAcesso === 'Líder' && subCargo === 'Liderado')
                ? lider
                : null, // Atribui liderId caso seja Liderado ou Líder com subCargo de Liderado
        };
        try {
            const response = yield axios_1.default.post(`${process.env.REACT_APP_API_URL}/api/usuarios`, usuario);
            if (response.status === 201) {
                alert("Usuário cadastrado com sucesso!");
                handleClear();
            }
        }
        catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert("Erro ao cadastrar usuário. Tente novamente.");
        }
    });
    const handleClear = () => {
        setNome('');
        setCpf('');
        setEmail('');
        setSenha('');
        setConfirmaSenha('');
        setNivelAcesso('');
        setLider('');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "form-container2", children: [(0, jsx_runtime_1.jsx)(Render_Menu_1.default, {}), (0, jsx_runtime_1.jsx)("h2", { children: "Cadastro de Usu\u00E1rio" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-row2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-column2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "nome", children: "Nome:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "nome", value: nome, onChange: (e) => setNome(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "cpf", children: "CPF:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "cpf", value: cpf, onChange: handleCpfChange, required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", children: "Email:" }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-column2", style: { marginTop: '1.1%' }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "nivelAcesso", children: "N\u00EDvel de Acesso:" }), (0, jsx_runtime_1.jsxs)("select", { id: "nivelAcesso", value: nivelAcesso, onChange: (e) => setNivelAcesso(e.target.value), required: true, style: { marginLeft: '4%', width: '80%' }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, hidden: true, children: "Defina o n\u00EDvel de acesso" }), (0, jsx_runtime_1.jsx)("option", { value: "L\u00EDder", children: "L\u00EDder" }), (0, jsx_runtime_1.jsx)("option", { value: "Liderado", children: "Liderado" })] })] }), nivelAcesso === 'Liderado' && ((0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "lider", children: "Selecione o L\u00EDder:" }), (0, jsx_runtime_1.jsxs)("select", { id: "lider", value: lider, onChange: (e) => setLider(e.target.value), required: true, style: { marginLeft: '4%', width: '80%', marginBottom: '3%' }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, hidden: true, children: "Escolha um l\u00EDder" }), lideres.map((lider) => ((0, jsx_runtime_1.jsx)("option", { value: lider.id, children: lider.nome }, lider.id)))] })] })), nivelAcesso === 'Líder' && ((0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "subCargo", children: "Sub-Cargo:" }), (0, jsx_runtime_1.jsxs)("select", { id: "subCargo", value: subCargo, onChange: (e) => setSubCargo(e.target.value), style: { marginLeft: '4%', width: '80%' }, children: [(0, jsx_runtime_1.jsx)("option", { children: "Nulo" }), (0, jsx_runtime_1.jsx)("option", { value: "Liderado", children: "Liderado" })] })] })), subCargo === 'Liderado' && nivelAcesso === 'Líder' && ((0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "lider", children: "Selecione o L\u00EDder:" }), (0, jsx_runtime_1.jsxs)("select", { id: "lider", value: lider, onChange: (e) => setLider(e.target.value), required: true, style: { marginLeft: '4%', width: '80%', marginBottom: '3%' }, children: [(0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, hidden: true, children: "Escolha um l\u00EDder" }), lideres.map((lider) => ((0, jsx_runtime_1.jsx)("option", { value: lider.id, children: lider.nome }, lider.id)))] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "senha", children: "Digite uma senha:" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "senha", value: senha, onChange: (e) => setSenha(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "confirmaSenha", children: "Confirme sua senha:" }), (0, jsx_runtime_1.jsx)("input", { type: "password", id: "confirmaSenha", value: confirmaSenha, onChange: (e) => setConfirmaSenha(e.target.value), required: true })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-buttons2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "btn-clear", onClick: handleClear, children: "Limpar" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-submit", children: "Cadastrar Usu\u00E1rio" })] })] })] }));
};
exports.default = (0, Hoc_Admin_1.default)(CadastroUsuario);
