import React, { useState, useEffect } from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';
import '../../static/CadastroPerguntas.css';
import axios from 'axios';

const CadastroAsk: React.FC = () => {
    const [categoriasExistentes, setCategoriasExistentes] = useState<string[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
    const [novaCategoria, setNovaCategoria] = useState(false);
    const [titlePes, setTitlePes] = useState('');
    const [sobrepesq, setSobrePesq] = useState('');
    const [catpesq, setCatPesq] = useState('');
    const [catperg, setCatPerg] = useState('');
    const [sobreperg, setSobrePerg] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '', '', '', '', '', '', '', '']);
    const [pergFormat, setPergFormat] = useState('');
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [buttonEdit, setButtonEdit] = useState(false);

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
        setPergFormat(e.target.value);
    };

    useEffect(() => {
        const buscarCategorias = async () => {
            if (catperg.trim() !== '') {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categorias`, {
                        params: { query: catperg }
                    });
                    setFilteredCategories(response.data);
                } catch (error) {
                    console.error('Erro ao buscar categorias:', error);
                }
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categorias`);
                setCategoriasExistentes(response.data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };

        buscarCategorias();
        fetchCategories();
    }, [catperg]);

    const handleClear1 = () => {
        setTitlePes('');
        setSobrePesq('');
        setCatPesq('');
        setIsSubmitted(false);
        setButtonsVisible(true);
        setButtonEdit(false);
    };

    const handleClear2 = () => {
        setSobrePerg('');
        setCatPerg('');
        setPergFormat('');
    };

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

                        window.removeEventListener('beforeunload', handleBeforeUnload);

                        handleClear1();
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

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCatPerg(e.target.value);
        setNovaCategoria(!categoriasExistentes.includes(e.target.value));
    };

    const handleSelectCategory = (category: string) => {
        setCatPerg(category);
        setFilteredCategories([]);
        setNovaCategoria(false);
    };

    const handleSubmitCategoria = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (novaCategoria) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cadastropergcategoria`, { catperg });
                alert('Nova categoria cadastrada com sucesso!');
            } else {
                alert('Categoria selecionada!');
            }
        } catch (error) {
            console.error('Erro ao cadastrar categoria:', error);
        }
    };

    return (
        <div>
            <RenderMenu />
            <div className='container3'>
                <div className='Bordada3'>
                    <h2 className='cadastrotitle' style={{ marginLeft: "7.5%", marginTop: '3%' }}>Cadastro de Pesquisas</h2>
                    <form className='form-row3' onSubmit={handleSubmitPesquisa}>
                        <div className='form-column3'>
                            <div className='form-group-ask'>
                                <p>Título da Pesquisa:</p>
                                <input 
                                    type='text' 
                                    id='titlepes' 
                                    name='titlepes'  
                                    onChange={(e) => setTitlePes(e.target.value)} 
                                    required 
                                    value={titlePes} 
                                    disabled={isSubmitted}
                                />
                            </div>
                            <div className='form-group-ask'>
                                <p>Sobre a Pesquisa:</p>
                                <textarea 
                                    id='sobrepesq' 
                                    name='sobrepesq' 
                                    onChange={(e) => setSobrePesq(e.target.value)} 
                                    required 
                                    value={sobrepesq}  
                                    disabled={isSubmitted}
                                />
                            </div>
                            <div className='form-group-ask'>
                                <p>Categoria da Pesquisa:</p>
                                <select 
                                    id="catpesq" 
                                    name="catpesq" 
                                    style={{ width: '100%', marginLeft: '4%' }} 
                                    onChange={(e) => setCatPesq(e.target.value)} 
                                    required 
                                    value={catpesq}  
                                    disabled={isSubmitted} 
                                >
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
                                <h2 className='cadastrotitle' style={{ marginTop: '10%', marginLeft: '2.5%' }}>Cadastro de Perguntas</h2>
                                <div className='form-group-ask'>
                                    <p>Categoria da Pergunta:</p>
                                    <input 
                                        type='text' 
                                        id='catperg' 
                                        name='catperg' 
                                        onChange={handleCategoriaChange} 
                                        required 
                                        value={catperg} 
                                    />
                                    {filteredCategories.length > 0 && (
                                        <div className="autocomplete-dropdown">
                                            <ul>
                                                {filteredCategories.map((category, index) => (
                                                    <li key={index} onClick={() => handleSelectCategory(category)}>
                                                        {category}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {novaCategoria && <p>Nova categoria será criada.</p>}
                                </div>
                                <div className='form-group-ask'>
                                    <p>Sobre a Pergunta:</p>
                                    <textarea 
                                        id='sobreperg' 
                                        name='sobreperg' 
                                        onChange={(e) => setSobrePerg(e.target.value)} 
                                        required 
                                        value={sobreperg} 
                                    />
                                </div>
                                <div className='form-group-ask'>
                                    <p>Formato da Pergunta:</p>
                                    <select 
                                        id="format" 
                                        name="format" 
                                        onChange={handleFormatChange} 
                                        required 
                                        value={pergFormat}
                                    >
                                        <option value="" disabled hidden>Selecione o formato da pergunta</option>
                                        <option value="Multipla Escolha">Múltipla Escolha</option>
                                        <option value="Unica Escolha">Única Escolha</option>
                                        <option value="Texto Longo">Texto Longo</option>
                                    </select>
                                </div>
                                {pergFormat !== 'Texto Longo' && (
                                    <div className='options'>
                                        <p>Opções:</p>
                                        {options.map((option, index) => (
                                            <input
                                                key={index}
                                                type='text'
                                                id={`option${index}`}
                                                name={`option${index}`}
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                placeholder={`Opção ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                                <button className='btn-submit2'>Cadastrar Pergunta</button>
                                <button type="button" className="btn-clear" onClick={handleClear2}> Limpar</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRole(CadastroAsk);
