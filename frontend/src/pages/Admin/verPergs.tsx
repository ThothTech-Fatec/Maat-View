import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RenderMenu from '../../components/Render_Menu';
import AdminRole from '../../hocs/Hoc_Admin';

const VerPergs: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtém o ID da pesquisa da URL
    const [perguntas, setPerguntas] = useState<any[]>([]);
    const [pesquisas, setPesquisas] = useState<any | null>(null); 
    const [error, setError] = useState<string | null>(null);
    const [pergunta, setPergunta] = useState<any | null>(null);


    interface Pesquisas {
        id: number; 
        titulo: string; 
        sobre: string; 
        categoria: string; 
    }

    // Busca as perguntas
    useEffect(() => {
        const fetchPerguntas = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/api/pesquisas/${id}/perguntas`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Erro ao buscar perguntas: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setPerguntas(data);
            } catch (error) {
                console.error('Erro:', error);
            }
        };

        fetchPerguntas();
        
    }, [id]);
    

// Busca as informações da pesquisa
useEffect(() => {
    const fetchPesquisa = async () => {
        if (!id) return; // Verifica se o ID está disponível

        try {
            const url = `${process.env.REACT_APP_API_URL}/api/perguntas/${id}`; 
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao buscar pesquisa: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setPesquisas(data); // Armazena as informações da pesquisa
        } catch (error) {
            console.error('Erro:', error);
            setError('Erro ao buscar pesquisa.');
        }
    };

    fetchPesquisa();
}, [id]);

    return (
        <div>
            <RenderMenu />
            <div className='content-container' style={{marginTop: '5%'}}>
                <h1 style={{ fontFamily: 'Outfit' }}>Detalhes da Pesquisa</h1>

                {pesquisas ? (
                <table className='userTable'>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                        </tr>
                    </thead>

                    <tr key={pesquisas.id}>
                        <td data-label="Título" >{pesquisas.titulo}</td>
                        <td data-label="Sobre" >{pesquisas.sobre}</td>
                        <td data-label="Categoria">{pesquisas.categoria}</td>
                    </tr>

                 </table>
            ) : (
                    <div>Carregando informações da pesquisa...</div>
            )}
            
                <h2 style={{ fontFamily: 'Outfit', marginTop: '20px' }}>Perguntas Cadastradas na Pesquisa: {pesquisas?.titulo}</h2>


                {error && <div className='error-message'>{error}</div>}
                {perguntas.length > 0 ? (
                    <table className='userTable'>
                        <thead>
                            <tr>
                                <th>Sobre</th>
                                <th>Formato</th>
                                <th>Categoria</th>
                                <th>Opções</th>
                            </tr>
                        </thead>

                            {perguntas.map(pergunta => (
                                <tr key={pergunta.id}>
                                    <td data-label="Sobre" >{pergunta.sobre}</td>
                                    <td data-label="Formato">{pergunta.formato}</td>
                                    <td data-label="Categoria">{pergunta.categoria}</td>
                                    <td data-label="Opções">
                                        {pergunta.opcoes.length > 0 ? (
                                            <ul>
                                                {pergunta.opcoes.map((opcao: string, index: number) => (
                                                    <li key={index}>{opcao}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>Nenhuma opção disponível</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </table>
                ) : (
                    <div>Nenhuma pergunta encontrada.</div>
                )}
            </div>
        </div>);
};

export default AdminRole(VerPergs);
