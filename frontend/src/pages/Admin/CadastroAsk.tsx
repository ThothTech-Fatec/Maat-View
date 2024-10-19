import React, { useState, useEffect } from 'react';
import ResponsiveMenu from '../../components/ADMResponsiveMenu'; 
import AdminRole from '../../hocs/Hoc_Admin';
import RenderMenu from '../../components/Render_Menu';
import '../../static/CadastroPerguntas.css';
import axios from 'axios';

const CadastroAsk: React.FC = () => {
    const [titlePes, setTitlePes] = useState('');
    const [sobrepesq, setSobrePesq] = useState('');
    const [catpesq,setCatPesq] = useState('');
    const [catperg , setCatPerg] = useState('');
    const [sobreperg , setSobrePerg] = useState('');
    const [options, setOptions] = useState<string[]>(['', '', '', '', '', '', '', '', '', '']);
    const [pergFormat, setPergFormat] = useState('');
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [buttonEdit , setButtonEdit] = useState(false);

    const [categoriasSugeridas, setCategoriasSugeridas] = useState<string[]>([]);
    const [novaCategoriaInputVisible, setNovaCategoriaInputVisible] = useState(false);
    const [novaCategoria, setNovaCategoria] = useState('');

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

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (catperg.length >= 2) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categorias`, {
                        params: { query: catperg }
                    });
                    setCategoriasSugeridas(response.data);
                } catch (error) {
                    console.error('Erro ao buscar categorias:', error);
                }
            } else {
                setCategoriasSugeridas([]);
            }
        }, 500);  // Delay de 500ms antes de realizar a busca
    
        return () => clearTimeout(timeoutId);  // Limpar timeout ao alterar o input
    }, [catperg]);

    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPergFormat(e.target.value);
        setCatPesq(e.target.value);
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
        setSobrePerg('');
        setCatPerg('');
        setPergFormat('');
        setOptions(['', '', '', '', '', '', '', '', '', '']); 
        setCategoriasSugeridas([]); 
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

// Função para buscar categorias conforme o usuário digita
const handleCatPergChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCatPerg(query);

    if (query.length >= 2) {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categorias`, {
                params: { query }
            });

            const categorias = response.data;

            // Verifica se o valor digitado já existe na lista de categorias
            const categoriaJaExiste = categorias.some((categoria: any) => 
                categoria.nome.toLowerCase() === query.toLowerCase()
            );

            // Se não existir uma correspondência exata, exibe as sugestões
            if (!categoriaJaExiste) {
                setCategoriasSugeridas(categorias);
            } else {
                setCategoriasSugeridas([]); // Limpa sugestões se já houver uma correspondência exata
            }
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    } else {
        setCategoriasSugeridas([]);
    }
};

    // Função para cadastrar nova categoria
    const handleCadastrarNovaCategoria = async () => {
        try {
            if (novaCategoria) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cadastropergcategoria`, { categoria: novaCategoria });
                
                if (response.status === 201) {
                    alert('Categoria cadastrada com sucesso!');
                    setNovaCategoriaInputVisible(false);
                    setNovaCategoria('');
                }
            } else {
                setNovaCategoriaInputVisible(false);
            }
        } catch (error) {
            console.error('Erro ao cadastrar nova categoria:', error);
            alert('Erro ao cadastrar nova categoria.');
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
                                <input type='text' id='titlepes' name='titlepes' onChange={(e) => setTitlePes(e.target.value)} required value={titlePes} disabled={isSubmitted}/>
                            </div>
                            <div className='form-group-ask'>
                                <p>Sobre a Pesquisa:</p>
                                <textarea id='sobrepesq' name='sobrepesq' onChange={(e) => setSobrePesq(e.target.value)} required value={sobrepesq} disabled={isSubmitted}/>
                            </div>
                            <div className='form-group-ask'>
                                <p>Categoria da Pesquisa:</p>
                                <select id="catpesq" name="catpesq" style={{ width: '100%', marginLeft: '4%' }} onChange={(e) => setCatPesq(e.target.value)} required value={catpesq} disabled={isSubmitted}>
                                    <option value="" disabled hidden>Defina a Categoria da Pesquisa</option>
                                    <option value="Auto Avaliação">Auto-Avaliação</option>
                                    <option value="Avaliação de Liderado">Avaliação de Liderado</option>
                                    <option value="Avaliação de Líder">Avaliação de Líder</option>
                                </select>
    
                                {buttonsVisible && (
                                    <>
                                        <button className='btn-submit2' style={{ margin: '4%', marginTop: '6%' }}>Cadastrar Pesquisa</button>
                                        <button type="button" className="btn-clear2" onClick={handleClear1}>Limpar</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
    
                    {showQuestionForm && (
                        <form className='form-row3' onSubmit={handleSubmitPergunta}>
                            <div className='form-column3'>
                                <h2 className='cadastrotitle' style={{marginTop: '10%', marginLeft:'2.5%'}}>Cadastro de Perguntas</h2>
                                <div className='form-group-ask'>
                                    <p>Categoria da Pergunta:</p>
                                    <input 
                                        type='text' 
                                        id='catperg' 
                                        name='catperg' 
                                        onChange={handleCatPergChange} 
                                        required 
                                        value={catperg}
                                    />
                                    {/* Mostrar sugestões de categorias existentes */}
                                    {categoriasSugeridas.length > 0 && (
                                        <ul>
                                            {categoriasSugeridas.map((categoria) => (
                                                <li key={categoria} onClick={() => setCatPerg(categoria)}>
                                                    {categoria}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
    
                                    {/* Botão para adicionar nova categoria */}
                                    <button type="button" className='btn-submit2' style={{ marginTop: '4%', marginLeft: '4%', marginBottom: '2%', fontSize: '13px', padding: '5px 10px ' }} onClick={() => setNovaCategoriaInputVisible(true)}>Adicionar nova categoria</button>
                                    {novaCategoriaInputVisible && (
                                        <div>
                                            <input 
                                                type='text' 
                                                id = 'catperg'
                                                value={novaCategoria} 
                                                onChange={(e) => setNovaCategoria(e.target.value)} 
                                                placeholder="Nova categoria"
                                            />
                                            <button type="button" className='btn-submit2' style={{marginTop: '1%', marginLeft: '4%', marginBottom: '2%', fontSize: '13px', padding: '5px 10px ' }} onClick={handleCadastrarNovaCategoria}>Cadastrar</button>
                                            <button type="button" className='btn-clear2' style={{marginTop: '1%', marginLeft: '4%', marginBottom: '2%', fontSize: '13px', padding: '5px 10px ' }} onClick={() => setNovaCategoriaInputVisible(false)}>Fechar</button>
                                        </div>
                                    )}
                                </div>
                                <div className='form-group-ask'>
                                    <p>Sobre a Pergunta:</p>
                                    <textarea id='textperg' name='sobreperg' onChange={(e) => setSobrePerg(e.target.value)} required value={sobreperg}/>
                                </div>
                                <div className='form-group-ask'>
                                    <p>Formato da Pergunta:</p>
                                    <select id='pergFormat' name='pergFormat' style={{ width: '90%', marginLeft: '5%' }} onChange={handleFormatChange} required value={pergFormat}>
                                        <option value="" disabled hidden>Escolha o formato da pergunta</option>
                                        <option value="Escolha Única">Escolha Única</option>
                                        <option value="Múltipla Escolha">Múltipla Escolha</option>
                                        <option value="Texto longo">Texto Longo</option>
                                    </select>
                                </div>
    
                                {(pergFormat === 'Escolha Única' || pergFormat === 'Múltipla Escolha') && (
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
    
                                <button className='btn-submit2' style={{ marginTop: '3%', marginLeft: '2%', marginRight: '38%'}}>Cadastrar Pergunta</button>
                                <button type="button" className="btn-clear2" onClick={handleClear2}>Limpar</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminRole(CadastroAsk);
