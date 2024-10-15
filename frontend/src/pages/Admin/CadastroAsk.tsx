import React from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';
import '../../css/cadastroask.css'








const CadastroAsk: React.FC = () => {
    return (
        <div>
            <RenderMenu />
            <div className='container'>
                <div className='Bordada3 '>
                <h2 className='cadastrotitle' style={{}}>Cadastro de Pesquisas</h2>
                <form>
                        <div className='form-group'>
                            <p>Título da Pesquisa:</p>
                            <input type='text' id='titlepes' name='titlepes' required />
                        </div>
                        
                        <div className='form-group'>
                            <p>Categoria da Pergunta:</p>
                            <input type='text' id='catperg' name='catperg' required />
                        </div>
                        
                        <div className='form-group'>
                            <p>Sobre a Pesquisa:</p>
                            <input type='email' id='sobrepesq' name='sobrepesq' required />
                        </div>

                <h3 className='cadastrotitle' style={{}}>Cadastro de Perguntas</h3>
                        
                </form>
                

                
                
                </div>
            </div>
            

            
            
        </div>
        
    );
};

export default AdminRole(CadastroAsk);
