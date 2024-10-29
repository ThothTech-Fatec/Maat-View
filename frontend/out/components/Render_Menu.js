"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ADMResponsiveMenu_1 = __importDefault(require("./ADMResponsiveMenu"));
const LIDERADOResponsiveMenu_1 = __importDefault(require("./LIDERADOResponsiveMenu"));
const LIDERResponsiveMenu_1 = __importDefault(require("./LIDERResponsiveMenu"));
const RenderMenu = () => {
    const [role, setRole] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);
    const renderMenu = () => {
        if (role === 'Admin') {
            return (0, jsx_runtime_1.jsx)(ADMResponsiveMenu_1.default, {});
        }
        else if (role === 'Líder') {
            return (0, jsx_runtime_1.jsx)(LIDERResponsiveMenu_1.default, {});
        }
        else if (role === 'Liderado') {
            return (0, jsx_runtime_1.jsx)(LIDERADOResponsiveMenu_1.default, {});
        }
    };
    return (0, jsx_runtime_1.jsx)("div", { children: renderMenu() });
};
exports.default = RenderMenu;
