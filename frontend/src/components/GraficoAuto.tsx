import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import jsPDF from 'jspdf'; // Importando jsPDF para geração do PDF
import Modal from './Modal'; // Importação do componente Modal
import '../static/GraficoAuto.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

const DashboardAutoavaliacao: React.FC = () => {
    const [progresso, setProgresso] = useState<ProgressoAutoavaliacao>({ total: 0, answered: 0, remaining: 0 });
    const [progressoRespondido, setProgressoRespondido] = useState<ProgressoRespondido>({ autoavaliacoesRespondidas: 0, avaliacoesRespondidas: 0, pesquisasRespondidas: [] });
    const [pesquisasRespondidas, setPesquisasRespondidas] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('week');

    useEffect(() => {
        const userId = localStorage.getItem('user_Id');

        const fetchProgresso = async () => {
            if (!userId) {
                setError('ID do usuário não encontrado.');
                return;
            }

            try {
                if (!process.env.REACT_APP_API_URL) {
                    throw new Error('URL da API não configurada.');
                }

                // Requisição para progresso da autoavaliação
                const responseProgresso = await fetch(`${process.env.REACT_APP_API_URL}/api/autoavaliacao/progresso/${userId}?dateFilter=${dateFilter}`);
                const dataProgresso = await responseProgresso.json();

                if (responseProgresso.ok) {
                    setProgresso(dataProgresso.progresso);
                }

                // Requisição para autoavaliações respondidas
                const responseRespondido = await fetch(`${process.env.REACT_APP_API_URL}/api/autoavaliacoes/respondidas/${userId}?dateFilter=${dateFilter}`);
                const dataRespondido = await responseRespondido.json();

                if (responseRespondido.ok) {
                    setProgressoRespondido(dataRespondido);
                    setPesquisasRespondidas(dataRespondido.pesquisasRespondidas || []);
                }

                // Requisição para detalhes das pesquisas respondidas
                const responsePesquisas = await fetch(`${process.env.REACT_APP_API_URL}/api/autoavaliacao/respondida/${userId}?dateFilter=${dateFilter}`);
                const dataPesquisas = await responsePesquisas.json();

                if (responsePesquisas.ok) {
                    setPesquisasRespondidas(dataPesquisas.pesquisas || []);
                }
            } catch (error) {
                console.error('Erro ao buscar progresso:', error);
                setError('Erro ao buscar progresso da autoavaliação.');
            }
        };

        fetchProgresso();
    }, [dateFilter]);

    const handleOpenModal = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalContent('');
    };

    const handlePieClick = (event: React.MouseEvent<HTMLCanvasElement>, elements: any[]) => {
        if (elements.length > 0) {
            const clickedIndex = elements[0].index;
            const clickedCategory = clickedIndex === 0 ? 'Respondidas' : 'Restantes';

            if (clickedCategory === 'Respondidas' && pesquisasRespondidas.length > 0) {
                const content = pesquisasRespondidas
                    .map((pesquisa) => `<strong>${pesquisa.titulo}</strong>: ${pesquisa.sobre} - Categoria: ${pesquisa.cat_pes}`)
                    .join('<br/>');
                handleOpenModal(content);
            } else {
                handleOpenModal('Não há pesquisas restantes.');
            }
        }
    };

    const pieChartData = {
        labels: ['Perguntas Respondidas', 'Perguntas Restantes'],
        datasets: [
            {
                label: 'Progresso da Autoavaliação',
                data: [progresso.answered, progresso.remaining],
                backgroundColor: ['#4CAF50', '#FF9800'],
                hoverBackgroundColor: ['#45A049', '#FF5722'],
            },
        ],
    };

    const barChartData = {
        labels: ['Autoavaliações Respondidas', 'Avaliações Respondidas'],
        datasets: [
            {
                label: 'Quantidade',
                data: [progressoRespondido.autoavaliacoesRespondidas, progressoRespondido.avaliacoesRespondidas],
                backgroundColor: ['#4CAF50', '#FF9800'],
                hoverBackgroundColor: ['#45A049', '#FF5722'],
            },
        ],
    };

    const maxBarValue = Math.max(progressoRespondido.autoavaliacoesRespondidas, progressoRespondido.avaliacoesRespondidas, 1);
    const barChartOptions = {
        responsive: true, // Mantém o gráfico responsivo
        maintainAspectRatio: false, // Permite ajustar o tamanho com base no contêiner
        onClick: (event: any, elements: any[]) => handlePieClick(event, elements),
        scales: {
            y: {
                beginAtZero: true,
                max: maxBarValue + maxBarValue / 1.5,
                ticks: {
                    stepSize: Math.ceil(maxBarValue / 5),
                },
            },
        },
    };
    

    // Função para gerar o PDF e realizar o download
    const generatePDF = () => {
        const doc = new jsPDF();
    
        // Obter o nome do usuário e a data atual
        const NomeUser = localStorage.getItem('nomeUser') || 'Usuário Desconhecido';  // Garantir que tenha um nome
        const currentDate = new Date().toLocaleDateString();  // Formatar data no formato padrão (DD/MM/YYYY)
    
        // Adicionar título
        doc.setFontSize(18);
        doc.text('Dashboard de Autoavaliação', 20, 20);
    
        // Adicionar nome do usuário e a data de criação
        doc.setFontSize(12);
        doc.text(`Nome do Usuário: ${NomeUser}`, 20, 30);
        doc.text(`Data de Criação: ${currentDate}`, 20, 40);
    
        // Adicionar informações dos gráficos
        doc.text(`Progresso: ${progresso.answered} perguntas respondidas, ${progresso.remaining} restantes`, 20, 50);
        doc.text(`Autoavaliações Respondidas: ${progressoRespondido.autoavaliacoesRespondidas}`, 20, 60);
        doc.text(`Avaliações Respondidas: ${progressoRespondido.avaliacoesRespondidas}`, 20, 70);
    
        // Adicionar informações das pesquisas respondidas
        doc.text('Pesquisas Respondidas:', 20, 80);
        pesquisasRespondidas.forEach((pesquisa, index) => {
            doc.text(`${index + 1}. ${pesquisa.titulo} - ${pesquisa.sobre}`, 20, 90 + index * 10);
        });
    
        // Gerar o PDF com o nome do usuário incluído no nome do arquivo
        doc.save(`Dashboard_De_${NomeUser}_em_${currentDate}.pdf`);
    };

    return (
        <div className='content-container4' style={{ marginLeft: '0px' }}>
            <div className="dashboard-container">
                <h2>Dashboard Autoavaliação</h2>
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
                    <h3>Perguntas Respondidas</h3>
                    <div className="pie-chart">
                        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false, onClick: (event: any, elements: any[]) => handlePieClick(event, elements) }} />
                    </div>
                    <div className="progress-info">
                        <p>Total de perguntas: {progresso.total}</p>
                        <p>Respondidas: {progresso.answered}</p>
                        <p>Restantes: {progresso.remaining}</p>
                    </div>
                </div>
                <h3> Respondidas</h3>
                <div className="bar-chart-container">
                    <div className="bar-chart" style={{ width: '100%', height: '400px' }}> {/* Ajuste no estilo */}
                        <Bar 
                            data={barChartData}
                            options={barChartOptions} 
                            height={400}
                        />
                    </div>
                    <div className="progress-info">
                        <p>Autoavaliações Respondidas: {progressoRespondido.autoavaliacoesRespondidas}</p>
                        <p>Avaliações Respondidas: {progressoRespondido.avaliacoesRespondidas}</p>
                    </div>
                </div>

                <button onClick={generatePDF}>Gerar PDF</button>


            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div>
                    <h3>Pesquisas Respondidas</h3>
                    <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                </div>
            </Modal>
        </div>
    );
};

export default DashboardAutoavaliacao;
