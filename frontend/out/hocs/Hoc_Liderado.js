"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const LideradoRole = (WrappedComponent) => {
    return (props) => {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'Liderado') {
            return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/unauthorized" });
        }
        return (0, jsx_runtime_1.jsx)(WrappedComponent, Object.assign({}, props));
    };
};
exports.default = LideradoRole;
