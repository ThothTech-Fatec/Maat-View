"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const logo_png_1 = __importDefault(require("../static/logo.png"));
const Unauthorized = () => {
    return ((0, jsx_runtime_1.jsx)("body", { className: 'login-body', children: (0, jsx_runtime_1.jsx)("div", { className: 'container', children: (0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: 150 }, children: [(0, jsx_runtime_1.jsx)("img", { src: logo_png_1.default, alt: "Logo", style: { display: 'block', width: '350px' } }), (0, jsx_runtime_1.jsx)("h1", { className: 'outfitTitle', style: { alignItems: 'center', justifyContent: 'center', display: 'flex' }, children: "Acesso N\u00E3o Autorizado" }), (0, jsx_runtime_1.jsx)("div", { className: "form-container" })] }) }) }));
};
exports.default = Unauthorized;
