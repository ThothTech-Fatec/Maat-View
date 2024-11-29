import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RenderMenu from '../components/Render_Menu';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import '../static/SuasAvaliacoes.css';

interface Pesquisa {
  id: number;
  titulo: string;
  data_criacao: string;
  sobre: string;
  cat_pes: string;
  avaliacoes_pendentes: number;
}

const PesquisasPage: React.FC = () => {
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
          <h1>Pesquisas Atuais</h1>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div>
              {pesquisas.length > 0 ? (
                pesquisas.map((pesquisa) => (
                  <div
                    key={pesquisa.id}
                    onClick={() => handlePesquisaClick(pesquisa)}
                    className="pesquisa-card4" 
                    style={{marginBottom: '5px'}}
                  >
                    <h3>{pesquisa.titulo}</h3>
                    <p>Categoria: {pesquisa.cat_pes}</p>
                    <p >Sobre: {pesquisa.sobre}</p>
                    <br></br>
                    <p>Data: {pesquisa.data_criacao}</p>
                  </div>
                  
                ))
                
              ) : (
                <p>Nenhuma pesquisa disponível no momento.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedPesquisa && (
          <div className="modal-content4"> {/* Classe atualizada */}
            <h2>{selectedPesquisa.titulo}</h2>
            <p>Categoria: {selectedPesquisa.cat_pes}</p>
            <p>Sobre: {selectedPesquisa.sobre}</p>
            <button
              className='buttonSubmitPerg4' 
              onClick={handleNavigate}
            >
              Ir para pesquisa
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PesquisasPage;