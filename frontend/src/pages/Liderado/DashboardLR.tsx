import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RenderMenu from '../../components/Render_Menu';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import '../../static/SuasAvaliacoes.css';
import DashboardAutoavaliacao from '../../components/GraficoAuto';

interface Pesquisa {
  id: number;
  titulo: string;
  sobre: string;
  cat_pes: string;
  avaliacoes_pendentes: number;
}

const DashboardLR: React.FC = () => {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPesquisa, setSelectedPesquisa] = useState<Pesquisa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPesquisas = async () => {
      const userId = localStorage.getItem('user_Id');
      console.log(userId);
      if (!userId) {
        console.error("Usuário não logado.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/verpesquisas-nao-respondidas/${userId}`);
        console.log("Resposta da API:", response.data);
  
        // Verificando a estrutura de resposta
        if (response.data && typeof response.data === 'object' && 'autoAvaliacao' in response.data && 'avaliacoesResponsavel' in response.data) {
          setPesquisas([...response.data.autoAvaliacao, ...response.data.avaliacoesResponsavel]);
        } else {
          console.error("Formato inesperado de resposta da API.", response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar pesquisas:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPesquisas();
  }, []);
  

  const handlePesquisaClick = (pesquisa: Pesquisa) => {
    setSelectedPesquisa(pesquisa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPesquisa(null);
  };

  const handleNavigate = () => {
    if (selectedPesquisa) {
      console.log("Navegando para:", selectedPesquisa.id);
      navigate(`/pesquisa/${selectedPesquisa.id}`); 
      handleCloseModal();
    }
  };

  return (
    <>
      <RenderMenu />
      <div className='content-container4' style={{marginTop: '1%'}}>
        <div style={{width: '100%'}}>
          <h1>Dashboard Pessoal</h1>
          <DashboardAutoavaliacao />
        </div>
      </div>
    </>
  );
};

export default DashboardLR;