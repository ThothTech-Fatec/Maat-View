"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "modal-overlay", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsx)("span", { className: "modal-close", onClick: onClose, children: "\u00D7" }), children] }) }));
};
exports.default = Modal;
