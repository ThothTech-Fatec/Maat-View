import React from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';


const CadastroUser: React.FC = () => {
    return (
        <div>
            <RenderMenu />
            
            
        </div>
        
    );
};

export default AdminRole(CadastroUser);
