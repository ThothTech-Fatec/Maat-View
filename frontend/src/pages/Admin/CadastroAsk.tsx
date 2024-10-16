import React from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';
import '../../static/CadastroPerguntas.css';

const CadastroAsk: React.FC = () => {
    return (
        <div>
            <RenderMenu />
            <div className='container3'>
                <div className='Bordada3 '>
                    {/* Formulário de Cadastro de Pesquisas */}
                    <h2 className='cadastrotitle'>Cadastro de Pesquisas</h2>
                    <form className='form-row3'>
                        <div className='form-column3'>
                            <div className='form-group-ask'>
                                <p>Título da Pesquisa:</p>
                                <input type='text' id='titlepes' name='titlepes' required />
                            </div>
                        <div className='form-group-ask'>
                        <p>Sobre a Pesquisa:</p>
                        <input type='text' id='sobrepesq' name='sobrepesq' required />
                    </div>
                    <div className='form-column3'>
                            <div className='form-group-ask'>
                                <p>Categoria da Pesquisa:</p>
                                <select id="category" name="category" style={{ width: '100%', marginLeft: '4%' }}>
                                    <option value="" disabled hidden>Defina a Categoria da Pesquisa</option>
                                    <option value="Auto Avaliação">Auto-Avaliação</option>
                                    <option value="Avaliação de Liderado">Avaliação de Liderado</option>
                                    <option value="Avaliação de Líder">Avaliação de Líder</option>
                                </select>
                            </div>
                            
                        </div>
                        </div>

                    </form>

                    {}
                    <h2 className='cadastrotitle'>Cadastro de Perguntas</h2>

                    <form className='form-row3'>
                        <div className='form-column3'>
                            <div className='form-group-ask'>
                                <p>Categoria da Pergunta:</p>
                                <input type='text' id='catperg' name='catperg' required />
                            </div>
                            <div className='form-column3'>
                            <div className='form-group-ask'>
                                <p>Formato da Pergunta:</p>
                                <input type='text' id='formtperg' name='formtperg' required />
                            </div>
                            <div className='form-group-ask'>
                                <p>Texto da Pergunta:</p>
                                <input type='text' id='textperg' name='formtperg' required />
                                </div>


                                <button style={{margin:'3%'}}>Cadastrar Pergunta</button>

   

                        </div>
                        

                            
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default AdminRole(CadastroAsk);
