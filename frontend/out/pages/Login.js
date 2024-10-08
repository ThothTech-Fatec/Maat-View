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
const logo_png_1 = __importDefault(require("../static/logo.png"));
const Login = () => {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        try {
            const response = yield fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = yield response.json();
                console.error('Erro do backend:', errorData);
                throw new Error('Falha na autenticação');
            }
            const data = yield response.json();
            console.log('Token recebido:', data.token);
            // Armazenando o token e informações do usuário no localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userRole', data.role); // Supondo que a resposta contenha a role do usuário
            // Redireciona para o Dashboard
            navigate('/dashboard');
        }
        catch (err) {
            setError('Erro no login.');
            console.error('Erro na requisição:', err);
        }
    });
    return ((0, jsx_runtime_1.jsx)("body", { className: 'login-body', children: (0, jsx_runtime_1.jsx)("div", { className: 'container', children: (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 150 }, children: [(0, jsx_runtime_1.jsx)("img", { src: logo_png_1.default, alt: "Logo", style: { display: 'block', width: '250px' } }), (0, jsx_runtime_1.jsx)("h1", { className: 'outfitTitle', style: { alignItems: 'center', justifyContent: 'center', display: 'flex' }, children: "Maat-View" }), (0, jsx_runtime_1.jsx)("div", { className: "form-container", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("div", { className: 'caixatexto', children: (0, jsx_runtime_1.jsx)("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: 'Insira seu email.', required: true }) }), (0, jsx_runtime_1.jsx)("div", { className: 'caixatexto', children: (0, jsx_runtime_1.jsx)("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: 'Insira sua senha.', required: true }) }), (0, jsx_runtime_1.jsx)("button", { className: 'entrar', type: "submit", children: "Entrar" })] }) }), error && (0, jsx_runtime_1.jsx)("p", { className: "error-message", style: { marginTop: 10 }, children: error })] }) }) }));
};
exports.default = Login;
