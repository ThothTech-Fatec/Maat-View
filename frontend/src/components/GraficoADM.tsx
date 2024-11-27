import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import jsPDF from 'jspdf'; // Importando jsPDF para geração do PDF
import Modal from './Modal'; // Importação do componente Modal
import '../static/GraficoAuto.css';
import axios from 'axios';

// Registrando os elementos necessários para os gráficos
ChartJS.register(
  ArcElement,      // Para gráficos de Pizza
  Tooltip,          // Para exibir informações ao passar o mouse
  Legend,           // Para exibir a legenda
  BarElement,       // Para gráficos de Barras
  CategoryScale,    // Para escalas de categoria no eixo X
  LinearScale,      // Para escalas lineares no eixo Y
  PointElement,     // Para gráficos de linha
  LineElement       // Para gráficos de linha
);
interface ProgressoAutoavaliacao {
    total: number;
    answered: number;
    remaining: number;
}

interface ProgressoRespondido {
    autoavaliacoesRespondidas: number;
    avaliacoesRespondidas: number;
    pesquisasRespondidas: any[];
}
interface ProgressoAutoavaliacaoLid {
    total: number;
    answered: number;
    remaining: number;
}
interface ProgressoRespondidoLid {
    autoavaliacoesRespondidas: number;
    avaliacoesRespondidas: number;
    pesquisasRespondidas: any[];
}

const GDashboardADM: React.FC = () => {
    const [progresso, setProgresso] = useState<ProgressoAutoavaliacao>({ total: 0, answered: 0, remaining: 0 });
    const [progressoRespondido, setProgressoRespondido] = useState<ProgressoRespondido>({ autoavaliacoesRespondidas: 0, avaliacoesRespondidas: 0, pesquisasRespondidas: [] });
    const [pesquisasRespondidas, setPesquisasRespondidas] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [selectedPesquisaId, setSelectedPesquisaId] = useState<string | null>(null); // Estado para armazenar o ID da pesquisa clicada
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Controle para o modal de detalhes
    const [detailsContent, setDetailsContent] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('week');
    const [cpf, setCpf] = useState<string>(''); // Estado para o CPF
    const [isCpfSubmitted, setIsCpfSubmitted] = useState<boolean>(false);

    const [progressoLid, setProgressoLid] = useState<ProgressoAutoavaliacaoLid>({ total: 0, answered: 0, remaining: 0 });
    const [progressoRespondidoLid, setProgressoRespondidoLid] = useState<ProgressoRespondidoLid>({ autoavaliacoesRespondidas: 0, avaliacoesRespondidas: 0, pesquisasRespondidas: [] });
    const [pesquisasRespondidasLid, setPesquisasRespondidasLid] = useState<any[]>([]);
    const [dateFilterLid, setDateFilterLid] = useState<string>('week');
    const [isModalOpenLid, setIsModalOpenLid] = useState(false);
    const [isDetailsModalOpenLid, setIsDetailsModalOpenLid] = useState(false); // Controle para o modal de detalhes
    const [detailsContentLid, setDetailsContentLid] = useState<string>('');
    const [modalContentLid, setModalContentLid] = useState<string>('');
    const nomeLiderado  = localStorage.getItem('nomeLiderado');
    const lideradoId = localStorage.getItem('lideradoId')

    const [chartData, setChartData] = useState({
        autoAvaliacao: 0,
        avaliacaoLiderado: 0,
        avaliacaoLider: 0,
    })
    const [activityData, setActivityData] = useState<any[]>([]);

    const [chartDataBarAdmin, setChartDataBarAdmin] = useState({
        totalPerguntasAResponder: 0,
        perguntasRespondidas: 0,
        totalPerguntasRestantes: 0,
    })

    useEffect(() => {
        const fetchEvaluationCounts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/pegartodaspes?dateFilter=${dateFilter}`);

                const responseTodasPes = await response.json();
                console.log(responseTodasPes.autoAvaliacao)

                if (responseTodasPes) {
                    setChartData(responseTodasPes);
                }

                const responsePergsTotal = await fetch(`${process.env.REACT_APP_API_URL}/api/pegarmediarespostas?dateFilter=${dateFilter}`);
                const perguntasTotal = await responsePergsTotal.json();
                setActivityData(perguntasTotal);


                const responsePergRestantes = await fetch(`${process.env.REACT_APP_API_URL}/api/pegarpergrestanteconcluida?dateFilter=${dateFilter}`)
                const dataPergRestantes = await responsePergRestantes.json();
                setChartDataBarAdmin(dataPergRestantes)
                

            } catch (error) {
                console.error('Erro ao buscar dados de avaliações:', error);
            }
        };

        fetchEvaluationCounts();
    }, [dateFilter]);

    const data = {
        labels: ['Auto Avaliação', 'Avaliação de Liderado', 'Avaliação de Líder'],
        datasets: [
            {
                data: [
                    chartData.autoAvaliacao,
                    chartData.avaliacaoLiderado,
                    chartData.avaliacaoLider,
                ],
                backgroundColor: ['#008000', '#5b1092', '#7fffd4'],
                hoverBackgroundColor: ['#0d730d', '#490d75', '#8cf2d0'],
            },
        ],
    };

    const chartDataPergs = {
        labels: activityData.map((item: { mes: string }) => item.mes),  // Meses (x-axis)
        datasets: [
          {
            label: 'Total de Respostas',
            data: activityData.map((item: { total_respostas: number }) => item.total_respostas),  // Número de respostas (y-axis)
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
          }
        ]
      };
      const barChartDataAdmin = {
        labels: ['Perguntas Distrubuídas','Perguntas Respondidas', 'Perguntas Pendentes'],
        datasets: [
            {
                label: 'Quantidade',
                data: [chartDataBarAdmin.totalPerguntasAResponder, chartDataBarAdmin.perguntasRespondidas, chartDataBarAdmin.totalPerguntasRestantes],
                backgroundColor: [ '#a4cdab','#4CAF50', '#FF9800'],
                hoverBackgroundColor: [ '#64946d','#45A049', '#FF5722'],
            },
        ],
    };


 
    const fetchPerguntasRespostasLid = async (pesquisaId: number) => {
        const lideradoId = localStorage.getItem('lideradoId');
        const userId = localStorage.getItem('user_Id');
        console.log(lideradoId);
    
        if (!lideradoId) {
            setError('ID do usuário não encontrado.');
            return;
        }
    
        try {
            if (!process.env.REACT_APP_API_URL) {
                throw new Error('URL da API não configurada.');
            }

            const responseLiderID = await fetch(`${process.env.REACT_APP_API_URL}/api/liderid-by-cpf/${cpf}`);
            const dataLiderId = await responseLiderID.json();
            const liderId = dataLiderId.liderId

            if (!liderId){
                const responseLiderado = await fetch(`${process.env.REACT_APP_API_URL}/api/autoavaliacao/perguntas-respostas/${lideradoId}/${pesquisaId}`);
                
                const dataLiderado = await responseLiderado.json();
        
                console.log('Resposta do Liderado:', dataLiderado);
        
                if (responseLiderado.ok ) {
                    // Verifica se o 'perguntas' existe nos dados do liderado
                    if (!Array.isArray(dataLiderado.perguntas)) {
                        setDetailsContentLid('Dados do Liderado não são um array.');
                        setIsDetailsModalOpenLid(true);
                        return;
                    }
        
                    // Processa as perguntas e respostas
                    const content = dataLiderado.perguntas
                        .map((p: { pergunta: string; respostas: string[] | null }) => {
                            const respostasFormatadasLiderado = p.respostas && p.respostas.length > 0 
                                ? p.respostas.join(', ') // Junta todas as respostas em uma string separada por vírgulas
                                : 'Não respondida'; // Caso não haja respostas

        
                            return `<strong>${p.pergunta}</strong>: <br/>
                                    <em>Resposta:</em> ${respostasFormatadasLiderado} <br/>`;
                        })
                        .join('<br/><br/>'); // Adiciona quebras de linha entre perguntas
        
                    setDetailsContentLid(content);
                    console.log(content);
                } else {
                    setDetailsContentLid(dataLiderado.message || 'Erro ao buscar perguntas e respostas.');
                }
        
                setIsDetailsModalOpenLid(true);
            }
            else{
            const responseLiderado = await fetch(`${process.env.REACT_APP_API_URL}/api/autoavaliacao/perguntas-respostas/${lideradoId}/${pesquisaId}`);
            const responseUsuario = await fetch(`${process.env.REACT_APP_API_URL}/api/buscaravapergs/${liderId}/${pesquisaId}`);
            
            const dataLiderado = await responseLiderado.json();
            const dataUsuario = await responseUsuario.json();
    
            console.log('Resposta do Liderado:', dataLiderado);
            console.log('Resposta do Usuário:', dataUsuario);
    
            if (responseLiderado.ok && responseUsuario.ok) {
                // Verifica se o 'perguntas' existe nos dados do liderado
                if (!Array.isArray(dataLiderado.perguntas)) {
                    setDetailsContentLid('Dados do Liderado não são um array.');
                    setIsDetailsModalOpenLid(true);
                    return;
                }
    
                // Processa as perguntas e respostas
                const content = dataLiderado.perguntas
                    .map((p: { pergunta: string; respostas: string[] | null }) => {
                        const respostasFormatadasLiderado = p.respostas && p.respostas.length > 0 
                            ? p.respostas.join(', ') // Junta todas as respostas em uma string separada por vírgulas
                            : 'Não respondida'; // Caso não haja respostas
    
                        const respostasFormatadasUsuario = dataUsuario.find((item: any) => item.pergunta === p.pergunta)?.resposta || 'Não respondida';
    
                        return `<strong>${p.pergunta}</strong>: <br/>
                                <em>Liderado:</em> ${respostasFormatadasLiderado} <br/>
                                <em>Líder:</em> ${respostasFormatadasUsuario}`;
                    })
                    .join('<br/><br/>'); // Adiciona quebras de linha entre perguntas
    
                setDetailsContentLid(content);
                console.log(content);
            } else {
                setDetailsContentLid(dataLiderado.message || 'Erro ao buscar perguntas e respostas.');
            }
    
            setIsDetailsModalOpenLid(true);
        }
        } catch (error) {
            console.error('Erro ao buscar perguntas e respostas:', error);
            setDetailsContentLid('Erro ao buscar perguntas e respostas.');
            setIsDetailsModalOpenLid(true);
        }
    };
    
    

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        if (value.length > 11) value = value.slice(0, 11); // Limita a entrada a 11 dígitos

        // Formata o CPF automaticamente
        if (value.length > 9) {
            value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
        } else if (value.length > 6) {
            value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
        } else if (value.length > 3) {
            value = `${value.slice(0, 3)}.${value.slice(3)}`;
        }

        setCpf(value);
    };

    const handleCpfSubmit = async () => {
    
        try {
            if (!process.env.REACT_APP_API_URL) {
                throw new Error('URL da API não configurada.');
            }
            const responseLiderID = await fetch(`${process.env.REACT_APP_API_URL}/api/liderid-by-cpf/${cpf}`);
            const dataLiderId = await responseLiderID.json();
            const liderId = dataLiderId.liderId
            console.log(liderId)


            if (!liderId) {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/todosuserid-by-cpf/${cpf}`);
                const data = await response.json();
        
                localStorage.setItem('lideradoId', data.id);
        
                if (response.ok) {
                    setIsCpfSubmitted(true);
                    console.log('Dados recebidos:', data);
                    localStorage.setItem('nomeLiderado', data.nomeLiderado);
        
                    // Atualiza os dados inicialmente
                    if (data) {
                        await fetchProgressAndResponses(data.id);
                    }
                } else {
                    setError(data.message || 'Erro ao verificar o CPF.');
                    setTimeout(() => setError(''), 3000); // Remove o erro após 3 segundos
                }
                
            }
            else{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/id-by-cpf/${cpf}/${liderId}`);
            const data = await response.json();
    
            localStorage.setItem('lideradoId', data.id);
    
            if (response.ok) {
                setIsCpfSubmitted(true);
                console.log('Dados recebidos:', data);
                localStorage.setItem('nomeLiderado', data.nomeLiderado);
    
                // Atualiza os dados inicialmente
                if (data) {
                    await fetchProgressAndResponses(data.id);
                }
            } else {
                setError(data.message || 'Erro ao verificar o CPF.');
                setTimeout(() => setError(''), 3000); // Remove o erro após 3 segundos
            }
        }

        } catch (error) {
            console.error('Erro ao enviar o CPF:', error);
            setError('Erro ao enviar o CPF.');
            setTimeout(() => setError(''), 3000);
        }
    };
    
    // Função para buscar progresso e respostas com base no líderado ID
    const fetchProgressAndResponses = async (lideradoId: string) => {
        try {
            if (!process.env.REACT_APP_API_URL) {
                throw new Error('URL da API não configurada.');
            }
    
            console.log(dateFilterLid);
    
            // Requisição para progresso da autoavaliação
            const responseProgresso = await fetch(
                `${process.env.REACT_APP_API_URL}/api/autoavaliacao/progresso/${lideradoId}?dateFilter=${dateFilterLid}`
            );
            const dataProgresso = await responseProgresso.json();
    
            if (responseProgresso.ok) {
                setProgressoLid(dataProgresso.progresso);
                console.log(dataProgresso.progresso);
            }
    
            // Requisição para autoavaliações respondidas
            const responseRespondido = await fetch(
                `${process.env.REACT_APP_API_URL}/api/autoavaliacoes/respondidas/${lideradoId}?dateFilter=${dateFilterLid}`
            );
            const dataRespondido = await responseRespondido.json();
    
            if (responseRespondido.ok) {
                setProgressoRespondidoLid(dataRespondido);
                setPesquisasRespondidasLid(dataRespondido.pesquisasRespondidas || []);
            }
    
            // Requisição para detalhes das pesquisas respondidas
            const responsePesquisas = await fetch(
                `${process.env.REACT_APP_API_URL}/api/autoavaliacao/respondida/${lideradoId}?dateFilter=${dateFilterLid}`
            );
            const dataPesquisas = await responsePesquisas.json();
            console.log(dataPesquisas)
    
            if (responsePesquisas.ok) {
                setPesquisasRespondidasLid(dataPesquisas.pesquisas || []);
            }
        } catch (error) {
            console.error('Erro ao buscar progresso:', error);
            setError('Erro ao buscar progresso da autoavaliação.');
            setTimeout(() => setError(''), 3000); // Remove o erro após 3 segundos
        }
    };
    
    // useEffect para monitorar mudanças no dateFilterLid
    useEffect(() => {
        const lideradoId = localStorage.getItem('lideradoId');
        if (lideradoId) {
            fetchProgressAndResponses(lideradoId);
        }
    }, [dateFilterLid]);
    
    

    const handleOpenModal = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent('');
    };
    
    const handleOpenModalLid = (content: string) => {
        setModalContentLid(content);
        setIsModalOpenLid(true);
    };
    const handleCloseModalLid = () => {
        setIsModalOpenLid(false);
        setModalContentLid('');
    };

    const handlePesquisaClick = (id: string) => {
        setSelectedPesquisaId(id);
        console.log('ID da pesquisa clicada:', id); // Realize alguma ação com este ID
    };



    const handlePieClickLid = (event: React.MouseEvent<HTMLCanvasElement>, elements: any[]) => {
        if (elements.length > 0) {
            const clickedIndex = elements[0].index;
            const clickedCategory = clickedIndex === 0 ? 'Respondidas' : 'Restantes';

            if (clickedCategory === 'Respondidas' && pesquisasRespondidasLid.length > 0) {
                const content = pesquisasRespondidasLid
                    .map((pesquisa) => `<strong>${pesquisa.titulo}</strong>: ${pesquisa.sobre} - Categoria: ${pesquisa.cat_pes}`)
                    .join('<br/>');
                handleOpenModalLid(content);
            } else {
                handleOpenModalLid('Não há pesquisas restantes.');
            }
        }
    };



    const pieChartDataLid = {
        labels: ['Perguntas Respondidas', 'Perguntas Restantes'],
        datasets: [
            {
                label: 'Progresso da Autoavaliação',
                data: [progressoLid.answered, progressoLid.remaining],
                backgroundColor: ['#4CAF50', '#FF9800'],
                hoverBackgroundColor: ['#45A049', '#FF5722'],
            },
        ],
    };

    const barChartDataLid = {
        labels: ['Autoavaliações Respondidas', 'Avaliações Respondidas'],
        datasets: [
            {
                label: 'Quantidade',
                data: [progressoRespondidoLid.autoavaliacoesRespondidas, progressoRespondidoLid.avaliacoesRespondidas],
                backgroundColor: ['#4CAF50', '#FF9800'],
                hoverBackgroundColor: ['#45A049', '#FF5722'],
            },
        ],
    };

    const maxBarValueLid = Math.max(progressoRespondidoLid.autoavaliacoesRespondidas, progressoRespondidoLid.avaliacoesRespondidas, 1);
    const barChartOptionsLid = {
        responsive: true, // Mantém o gráfico responsivo
        maintainAspectRatio: false, // Permite ajustar o tamanho com base no contêiner
        onClick: (event: any, elements: any[]) => handlePieClickLid(event, elements),
        scales: {
            y: {
                beginAtZero: true,
                max: maxBarValueLid + maxBarValueLid / 1.5,
                ticks: {
                    stepSize: Math.ceil(maxBarValueLid / 5),
                },
            },
        },
    };



    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setDetailsContent('');
    };
    
    const handleCloseDetailsModalLid = () => {
        setIsDetailsModalOpenLid(false);
        setDetailsContentLid('');
    };


        // Função para gerar o PDF e realizar o download das infos do Lid
        const generatePDFLid = () => {
            const doc = new jsPDF();
        
            // Obter o nome do usuário e a data atual
            const NomeLid = localStorage.getItem('nomeLiderado') || 'Usuário Desconhecido';  // Garantir que tenha um nome
            const currentDate = new Date().toLocaleDateString();  // Formatar data no formato padrão (DD/MM/YYYY)
        
            // Adicionar título
            doc.setFontSize(18);
            doc.text('Dashboard de Autoavaliação', 20, 20);
        
            // Adicionar nome do usuário e a data de criação
            doc.setFontSize(12);
            doc.text(`Nome do Usuário: ${NomeLid}`, 20, 30);
            doc.text(`Data de Criação: ${currentDate}`, 20, 40);
        
            // Adicionar informações dos gráficos
            doc.text(`Progresso: ${progressoLid.answered} perguntas de auto-avaliação respondidas, ${progressoLid.remaining} restantes`, 20, 50);
            doc.text(`Autoavaliações Respondidas: ${progressoRespondidoLid.autoavaliacoesRespondidas}`, 20, 60);
            doc.text(`Avaliações Respondidas: ${progressoRespondidoLid.avaliacoesRespondidas}`, 20, 70);
        
            // Adicionar informações das pesquisas respondidas
            doc.text('Pesquisas Respondidas:', 20, 80);
            pesquisasRespondidasLid.forEach((pesquisa, index) => {
                doc.text(`${index + 1}. ${pesquisa.titulo} - ${pesquisa.sobre}`, 20, 90 + index * 10);
            });
        
            // Gerar o PDF com o nome do usuário incluído no nome do arquivo
            doc.save(`Dashboard_De_${NomeLid}_em_${currentDate}.pdf`);
        };

    return (
        <div className='content-container4' style={{ marginLeft: '0px' }}>
            <div className="dashboard-container">
                <h2>Dashboard De Avaliações</h2>
                <label htmlFor="dateFilter">Filtrar por:</label>
                <select
                    id="dateFilter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                >
                    <option value="week">Última Semana</option>
                    <option value="month">Último Mês</option>
                    <option value="year">Último Ano</option>
                </select>

                <div className="pie-chart-container">
                    <h3>Quantidade de Pesquisas</h3>
                    <div className="pie-chart" style={{marginBottom:'50px'}}>
                    <Pie data={data} options={{ responsive: true,maintainAspectRatio: false, plugins: {legend: {display: true,position: 'bottom'}}}} />
                    </div>
                    <div className="progress-info">
                        <p>Auto-Avaliações: {chartData.autoAvaliacao}</p>
                        <p>Avaliações de Líder: {chartData.avaliacaoLider}</p>
                        <p>Avaliações de Liderado: {chartData.avaliacaoLiderado}</p>
                    </div>
                </div>


                <h3>Perguntas de Auto-Avaliação Geral</h3>
                <div className="bar-chart-container">
                    <div className="bar-chart" style={{ width: '100%', height: '400px', marginBottom:'50px' }}> {/* Ajuste no estilo */}
                        <Bar 
                            data={barChartDataAdmin}
                            options={{responsive: true,maintainAspectRatio: false}} 
                            height={400}
                        /> </div>
                    <div className="progress-info">
                        <p>Perguntas Distribuídas: {chartDataBarAdmin.totalPerguntasAResponder}</p>
                        <p>Perguntas Respondidas: {chartDataBarAdmin.perguntasRespondidas}</p>
                        <p>Perguntas Pendentes: {chartDataBarAdmin.totalPerguntasRestantes}</p>
                    </div>
                </div>

                <h3>Comparação de Respostas em Datas Diferentes</h3>
                <div className="bar-chart-container">
                    <div className="bar-chart" style={{ marginBottom:'50px' }}> {/* Ajuste no estilo */}
                    <Line data={chartDataPergs} options={{ responsive: true, maintainAspectRatio: false }} height={400} />
                    </div>
                </div>

            </div>

            <h1 style={{marginTop:'50px'}}>Dashboard Do Usuário</h1>

            <div className="dashboard-container" >
                <h2>Dashboard Pessoal do Usuário</h2>
                {/* ...resto do conteúdo do dashboard... */}
                    <h3>Buscar por CPF</h3>
                    <div>
                        <input
                            type="text"
                            placeholder="Digite o CPF"
                            value={cpf}
                            onChange={handleCpfChange}
                            maxLength={14} // Limita a entrada formatada a 14 caracteres
                            style={{ padding: '10px', marginRight: '10px', width: '200px' }}
                        />
                        <button
                            onClick={handleCpfSubmit}
                            style={{
                                padding: '10px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius:'5px',
                                marginTop:'10px'
                            }}
                        >
                            Buscar
                        </button>
                    </div>

                    {isCpfSubmitted && <h3 style={{ color: 'green', marginBottom:'17px' }}>Dashboard De {nomeLiderado}.</h3>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {isCpfSubmitted && (
                    <>  


                <label htmlFor="dateFilterLid">Filtrar por:</label>
                <select
                    id="dateFilterLid"
                    value={dateFilterLid}
                    onChange={(e) => setDateFilterLid(e.target.value)}
                >
                    <option value="week">Última Semana</option>
                    <option value="month">Último Mês</option>
                    <option value="year">Último Ano</option>
                </select>

                <div className="pie-chart-container">
                    <h3>Perguntas de Auto-Avaliação Respondidas</h3>
                    <div className="pie-chart" style={{marginBottom:'50px'}}>
                        <Pie data={pieChartDataLid} options={{ responsive: true, maintainAspectRatio: false, onClick: (event: any, elements: any[]) => handlePieClickLid(event, elements) }} />
                        <p style={{fontSize:'10pt'}}>*Clique no gráfico para ver as pesquisas respondidas*</p>
                    </div>
                    <div className="progress-info">
                        <p>Total de perguntas: {progressoLid.total}</p>
                        <p>Respondidas: {progressoLid.answered}</p>
                        <p>Restantes: {progressoLid.remaining}</p>
                    </div>
                </div>
                <h3>Pesquisas Respondidas</h3>
                <div className="bar-chart-container">
                    <div className="bar-chart" style={{ width: '100%', height: '400px', marginBottom:'50px'}}> {/* Ajuste no estilo */}
                        <Bar 
                            data={barChartDataLid}
                            options={barChartOptionsLid} 
                            height={400}
                        />
                        <p style={{fontSize:'10pt'}}>*Clique no gráfico para ver as pesquisas respondidas*</p>
                    </div>
                    <div className="progress-info">
                        <p>Autoavaliações Respondidas: {progressoRespondidoLid.autoavaliacoesRespondidas}</p>
                        <p>Avaliações Respondidas: {progressoRespondidoLid.avaliacoesRespondidas}</p>
                    </div>
                </div>

                <button onClick={generatePDFLid} style={{ borderRadius:'5px',}}>Gerar PDF</button>
                    
                    
                    </>
                    )}

            </div>

            <Modal isOpen={isModalOpenLid} onClose={handleCloseModalLid}>
            <div>
                <h3>Pesquisas Respondidas</h3>
                <ul>
                    {pesquisasRespondidasLid.map((pesquisa) => (
                        <li
                            key={pesquisa.id}
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                            onClick={() => fetchPerguntasRespostasLid(pesquisa.id)}
                        >
                            {pesquisa.titulo}
                        </li>
                    ))}
                </ul>
            </div>
            </Modal>
            <Modal isOpen={isDetailsModalOpenLid} onClose={handleCloseDetailsModalLid}>
                <div dangerouslySetInnerHTML={{ __html: detailsContentLid }} style={{margin:'20px'}} />
            </Modal>

        </div>
    );
};

export default GDashboardADM;
