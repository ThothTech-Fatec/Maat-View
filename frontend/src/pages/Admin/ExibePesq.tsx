    import React, { useEffect, useState } from 'react';
    import RenderMenu from '../../components/Render_Menu';

    interface Pesquisas {
        id: number; 
        titulo: string; 
        sobre: string; 
        cat_pes: string; 
    }

    const ExibePesq: React.FC = () => {
        const [pesquisas, setPesquisas] = useState<Pesquisas[]>([]);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            const fetchPesquisas = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pesquisas`);
                    if (!response.ok) {
                        throw new Error('Erro ao buscar pesquisas');
                    }
                    const data = await response.json();
                    setPesquisas(data); 
                } catch (error) {
                    console.error('Erro:', error);
                    setError('Erro ao buscar pesquisas.'); 
                }
            };

            fetchPesquisas();
        }, []);

        const handleDelete = async (pes_id: number) => {
            const confirmDelete = window.confirm('Você realmente deseja apagar esta pesquisa?');
            if (confirmDelete) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pesquisas/${pes_id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error('Erro ao apagar a pesquisa');
                    }
                    setPesquisas(pesquisas.filter(pesquisas => pesquisas.id !== pes_id));
                } catch (error) {
                    console.error('Erro:', error);
                    setError('Erro ao apagar a pesquisa.');
                }
            }
        };

        return (
            <div>
                <RenderMenu />
                <div className='content-container'>
                    <div className='contentTitle'>
                        PESQUISAS
                    </div>
                    {error && <div className='error-message'>{error}</div>} 
                    <table className='userTable'>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Sobre</th>
                                <th>Categoria</th>
                                <th>Exibir</th> 
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pesquisas.map((pesquisas) => (
                                <tr key={pesquisas.id}>
                                    <td data-label="Título">{pesquisas.titulo}</td>
                                    <td data-label="Sobre">{pesquisas.sobre}</td>
                                    <td data-label="Categoria">{pesquisas.cat_pes}</td>
                                    <td data-label="Exibir"></td>
                                    <td data-label="Ações">
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    export default ExibePesq;
