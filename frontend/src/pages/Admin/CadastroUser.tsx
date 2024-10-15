import React from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';







const CadastroUser: React.FC = () => {
    return (
        <div>
            <RenderMenu />
            <div className='container'>
                <div className='Bordada2 outfitTexto'>
                <h2 className='cadastrotitle' style={{}}>Cadastro de Usuário</h2>
                <form>
                        <div className='form-group'>
                            <p>Nome:</p>
                            <input type='text' id='name' name='name' required />
                        </div>
                        
                        <div className='form-group'>
                            <p>CPF:</p>
                            <input type='text' id='cpf' name='cpf' required />
                        </div>
                        
                        <div className='form-group'>
                            <p>Email:</p>
                            <input type='email' id='email' name='email' required />
                        </div>
                        
                    </form>
                

                
                
                </div>
            </div>
            

            
            
        </div>
        
    );
};

export default AdminRole(CadastroUser);
