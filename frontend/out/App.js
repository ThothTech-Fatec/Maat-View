"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Login_1 = __importDefault(require("./pages/Login"));
const Dashboard_1 = __importDefault(require("./pages/Admin/Dashboard"));
const MinhasInfo_1 = __importDefault(require("./pages/MinhasInfo"));
const CadastroUser_1 = __importDefault(require("./pages/Admin/CadastroUser"));
const ExibeUser_1 = __importDefault(require("./pages/Admin/ExibeUser"));
const Unauthorized_1 = __importDefault(require("./pages/Unauthorized"));
const CadastroAsk_1 = __importDefault(require("./pages/Admin/CadastroAsk"));
const ExibePesq_1 = __importDefault(require("./pages/Admin/ExibePesq"));
const verPergs_1 = __importDefault(require("./pages/Admin/verPergs"));
const SuasAvalia__es_1 = __importDefault(require("./pages/SuasAvalia\u00E7\u00F5es"));
const Formul_rio_1 = __importDefault(require("./pages/Formul\u00E1rio"));
const App = () => {
    return ((0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login" }) }), "  ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(Login_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/dashboard", element: (0, jsx_runtime_1.jsx)(Dashboard_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/minhas_info", element: (0, jsx_runtime_1.jsx)(MinhasInfo_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/cadastro_de_user", element: (0, jsx_runtime_1.jsx)(CadastroUser_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/cadastro_de_ask", element: (0, jsx_runtime_1.jsx)(CadastroAsk_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/exibe_user", element: (0, jsx_runtime_1.jsx)(ExibeUser_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/unauthorized", element: (0, jsx_runtime_1.jsx)(Unauthorized_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/exibe_search", element: (0, jsx_runtime_1.jsx)(ExibePesq_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/ver-Pergs", element: (0, jsx_runtime_1.jsx)(verPergs_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/ver-Pergs/:id", element: (0, jsx_runtime_1.jsx)(verPergs_1.default, {}) }), "  ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/minhas_avalia\u00E7oes", element: (0, jsx_runtime_1.jsx)(SuasAvalia__es_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/pesquisa/:pesquisaId", element: (0, jsx_runtime_1.jsx)(Formul_rio_1.default, {}) })] }) }));
};
exports.default = App;
