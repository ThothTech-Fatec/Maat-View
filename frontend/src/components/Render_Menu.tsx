import React, { useEffect, useState } from "react";
import AdminResponsiveMenu from "./ADMResponsiveMenu";
import LideradoResponsiveMenu from "./LIDERADOResponsiveMenu";
import LiderResponsiveMenu from "./LIDERResponsiveMenu";

const RenderMenu: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const renderMenu = () => {
        if (role === 'Admin') {
            return <AdminResponsiveMenu />;
        } else if (role === 'Líder') {
            return <LiderResponsiveMenu />;
        } else if (role === 'Liderado') {
            return <LideradoResponsiveMenu />;
        }
    };

    return <div>{renderMenu()}</div>;
};

export default RenderMenu;
