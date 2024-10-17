import React, { useState } from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';
import '../../static/CadastroPerguntas.css';

const CadastroAsk: React.FC = () => {
    // Estado para armazenar o formato da pergunta
    const [pergFormat, setPergFormat] = useState('');

    // Função para lidar com a mudança do formato da pergunta
    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPergFormat(e.target.value);
    };

    return (
        <div>
            <RenderMenu />
            <div className='container3'>
                <div className='Bordada3'>
                    <h2 className='cadastrotitle'>Cadastro de Pesquisas</h2>
                    <form className='form-row3'>
                        <div className='form-column3'>
                            <div className='form-group-ask'>
                                <p>Título da Pesquisa:</p>
                                <input type='text' id='titlepes' name='titlepes' required />
                            </div>
                            <div className='form-group-ask'>
                                <p>Sobre a Pesquisa:</p>
                                <textarea id='sobrepesq' name='sobrepesq' required />
                            </div>
                            <div className='form-group-ask'>
                                <p>Categoria da Pesquisa:</p>
                                <select id="category" name="category" style={{ width: '100%', marginLeft: '4%' }}>
                                    <option value="" disabled hidden>Defina a Categoria da Pesquisa</option>
                                    <option value="Auto Avaliação">Auto-Avaliação</option>
                                    <option value="Avaliação de Liderado">Avaliação de Liderado</option>
                                    <option value="Avaliação de Líder">Avaliação de Líder</option>
                                </select>
                            </div>
                        
                            <h2 className='cadastrotitle' style={{marginTop: '10%'}}>Cadastro de Perguntas</h2>
                            <div className='form-group-ask'>
                                <p>Categoria da Pergunta:</p>
                                <input type='text' id='catperg' name='catperg' required />
                            </div>
                            
                            <div className='form-group-ask'>
                                <p>Formato da Pergunta:</p>
                                <select id="pergformat" name="pergformat" style={{ width: '100%', marginLeft: '4%' }} onChange={handleFormatChange}>
                                    <option value="" disabled hidden>Defina o Formato da Pergunta</option>
                                    <option value="Texto Longo">Texto Longo</option>
                                    <option value="Escolha Única">Escolha Única</option>
                                    <option value="Multipla Escolha">Multipla Escolha</option>
                                </select>
                            </div>
                            
                            {/* Método para se caso o formato for Multipla Escolha ou Escolha Única, ira aparecer as opções*/}
                            {(pergFormat === 'Escolha Única' || pergFormat === 'Multipla Escolha') && (
                                <div style={{marginLeft:'4%'}}>
                                    <h3>Opções:</h3>
                                    <div className='options-row'>
                                        <div className='options-column'>
                                            {[...Array(5)].map((_, index) => (
                                                <div className='form-group-ask-options' key={index}>
                                                    <p>Opção {index + 1}:</p>
                                                    <textarea 
                                                        id={`option${index + 1}`} 
                                                        name={`option${index + 1}`} 
                                                        required={index < 2} // Apenas as opções 1 e 2 são obrigatórias
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className='options-column'>
                                            {[...Array(5)].map((_, index) => (
                                                <div className='form-group-ask-options' key={index + 5}>
                                                    <p>Opção {index + 6}:</p>
                                                    <textarea 
                                                        id={`option${index + 6}`} 
                                                        name={`option${index + 6}`} 
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className='form-group-ask'>
                                <p>Texto da Pergunta:</p>
                                <textarea id='textperg' name='formtperg' required />
                            </div>

                            <button style={{ margin: '3%', marginTop: '3%' }}>Cadastrar Pergunta</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminRole(CadastroAsk);
