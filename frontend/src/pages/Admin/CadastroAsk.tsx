import React, { useState, useEffect } from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';
import '../../static/CadastroPerguntas.css';
import axios from 'axios';

const CadastroAsk: React.FC = () => {
    const [titlePes, setTitlePes] = useState('')
    const [sobrepesq, setSobrePesq] = useState('')
    const [catpesq,setCatPesq] = useState('')
    const [catperg , setCatPerg] = useState('')
    const [sobreperg , setSobrePerg] = useState('')
    const [options, setOptions] = useState<string[]>(['', '', '', '', '', '', '', '', '', '']);
    const [pergFormat, setPergFormat] = useState('')
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [buttonEdit , setButtonEdit] = useState(false)

    // Função move para fora do useEffect
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (titlePes || sobrepesq || catpesq || catperg || sobreperg || pergFormat || showQuestionForm) {
            e.preventDefault();
            e.returnValue = ''; 
        }
    };

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [titlePes, sobrepesq, catpesq, catperg , sobreperg, pergFormat, showQuestionForm]);

    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPergFormat(e.target.value),setCatPesq(e.target.value);
    };

    const handleClear1 = () => {
        setTitlePes('');
        setSobrePesq('');
        setCatPesq('');
        setIsSubmitted(false);
        setButtonsVisible(true);
        setButtonEdit(false);
    };

    const handleClear2 =() =>{
        setSobrePerg('')
        setCatPerg('')
        setPergFormat('')
    }

    const handleSubmitPesquisa = async (e: React.FormEvent) => {
        e.preventDefault();
        const pesquisas = { titlePes, sobrepesq, catpesq };
        
        try {
            if (titlePes && sobrepesq && catpesq) {
                const userConfirmed = window.confirm(
                    "Deseja cadastrar a Pesquisa? Não será possível realizar alterações."
                );

                if (userConfirmed) {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cadastropesquisas`, pesquisas);

                    if (response.status === 201 || response.status === 200) {
                        alert('Pesquisa cadastrada com sucesso!');

                        // Remove o listener após submissão
                        window.removeEventListener('beforeunload', handleBeforeUnload);

                        handleClear2();
                        setShowQuestionForm(true);
                        setIsSubmitted(true);
                        setButtonsVisible(false);
                        setButtonEdit(true);
                    }
                }
            } else {
                alert('Por favor, preencha todos os campos da pesquisa.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar/atualizar pesquisa:', error);
            alert('Erro ao cadastrar/atualizar a pesquisa. Tente novamente.');
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };


    const handleSubmitPergunta = async (e: React.FormEvent) => {
        e.preventDefault();
        const filledOptions = options.filter(option => option.trim() !== '');
        const pergunta = {
            titlePes,
            categoriaPergunta: catperg, 
            sobrePergunta: sobreperg,
            formatoPergunta: pergFormat,
            options: filledOptions.length > 0 ? filledOptions : null
        };
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cadastrarpergunta`, pergunta);
    
            if (response.status === 201) {
                alert('Pergunta cadastrada com sucesso!');
                handleClear2();
                window.removeEventListener('beforeunload', handleBeforeUnload);
            }
        } catch (error) {
            console.error('Erro ao cadastrar pergunta:', error);
            alert('Erro ao cadastrar a pergunta. Tente novamente.');
        }
    };

    return (
        <div>
            <RenderMenu />
            <div className='container3'>
                <div className='Bordada3'>
                    <h2 className='cadastrotitle' style={{marginLeft:"7.5%",marginTop:'3%'}}>Cadastro de Pesquisas</h2>
                    <form className='form-row3' onSubmit={handleSubmitPesquisa}>
                        <div className='form-column3'>
                            <div className='form-group-ask'>
                                <p>Título da Pesquisa:</p>
                                <input type='text' id='titlepes' name='titlepes'  onChange={(e) => setTitlePes(e.target.value)} required value={titlePes} disabled={isSubmitted}/>
                            </div>
                            <div className='form-group-ask'>
                                <p>Sobre a Pesquisa:</p>
                                <textarea id='sobrepesq' name='sobrepesq' onChange={(e) => setSobrePesq(e.target.value)} required value={sobrepesq}  disabled={isSubmitted}/>
                            </div>
                            <div className='form-group-ask'>
                                <p>Categoria da Pesquisa:</p>
                                <select id="catpesq" name="catpesq" style={{ width: '100%', marginLeft: '4%' }} onChange={(e) => setCatPesq(e.target.value)} required value={catpesq}  disabled={isSubmitted} >
                                    <option value="" disabled hidden>Defina a Categoria da Pesquisa</option>
                                    <option value="Auto Avaliação">Auto-Avaliação</option>
                                    <option value="Avaliação de Liderado">Avaliação de Liderado</option>
                                    <option value="Avaliação de Líder">Avaliação de Líder</option>
                                </select>

                                {buttonsVisible && (
                                    <>
                                        <button className='btn-submit2' style={{ margin: '4%', marginTop: '6%' }} >Cadastrar Pesquisa</button>
                                        <button type="button" className="btn-clear" onClick={handleClear1}> Limpar</button>
                                    </>
                                )}
                            </div>
                            </div>
                            </form>
                            {showQuestionForm && (
                                <form className='form-row3' onSubmit={handleSubmitPergunta}>
                                    <div className='form-column3'>
                                    <h2 className='cadastrotitle' style={{marginTop: '10%',marginLeft:'2.5%'}}>Cadastro de Perguntas</h2>
                                    <div className='form-group-ask'>
                                        <p>Categoria da Pergunta:</p>
                                        <input type='text' id='catperg' name='catperg'  onChange={(e) => setCatPerg(e.target.value)} required value={catperg}  />
                                    </div>  
                                    <div className='form-group-ask'>
                                        <p>Formato da Pergunta:</p>
                                        <select id="pergformat" name="pergformat" style={{ width: '100%', marginLeft: '4%' }} onChange={(e) => setPergFormat(e.target.value)} required value={pergFormat}  >
                                            <option value="" disabled hidden>Defina o Formato da Pergunta</option>
                                            <option value="Texto Longo">Texto Longo</option>
                                            <option value="Escolha Única">Escolha Única</option>
                                            <option value="Multipla Escolha">Multipla Escolha</option>
                                        </select>
                                    </div>
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
                                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                                required={index < 2} 
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
                                                                onChange={(e) => handleOptionChange(index + 5, e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className='form-group-ask'>
                                        <p>Texto da Pergunta:</p>
                                        <textarea id='textperg' name='formtperg' required onChange={(e) => setSobrePerg(e.target.value)}  value={sobreperg}/>
                                    </div>
                                    <button className='btn-submit2' style={{ margin: '3%', marginTop: '3%' }}>Cadastrar Pergunta</button>
                                    <button type="button" className="btn-clear" onClick={handleClear2}>
                                        Limpar
                                    </button>
                                    </div>
                                </form>
                            )}
                </div>
            </div>
        </div>
    );
};

export default AdminRole(CadastroAsk);
