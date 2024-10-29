"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const AdminRole = (WrappedComponent) => {
    return (props) => {
        const userRole = localStorage.getItem('userRole'); // Pegamos o cargo com base no token guardado
        if (userRole !== 'Admin') {
            return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/unauthorized" }); // Redireciona para a página de não autorizado
        }
        // Retorna o componente envolto se o usuário for admin
        return (0, jsx_runtime_1.jsx)(WrappedComponent, Object.assign({}, props));
    };
};
exports.default = AdminRole;
