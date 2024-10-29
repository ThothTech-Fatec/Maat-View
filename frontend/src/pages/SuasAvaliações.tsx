import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RenderMenu from '../components/Render_Menu';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

interface Pesquisa {
  id: number;
  titulo: string;
  sobre: string;
  cat_pes: string;
}

const PesquisasPage: React.FC = () => {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPesquisa, setSelectedPesquisa] = useState<Pesquisa | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPesquisas = async () => {
      try {
        const response = await axios.get<Pesquisa[]>(`${process.env.REACT_APP_API_URL}/api/verpesquisas`);
        setPesquisas(response.data);
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
      navigate(`/pesquisa/${selectedPesquisa.id}`); 
      handleCloseModal();
    }
  };

  return (
    <>
      <RenderMenu />
      <div className='content-container' style={{marginTop: '6%', fontFamily:'Outfit'}}>
        <div style={{width: '100%'}}>
        <h1>Pesquisas Atuais</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div>
            {pesquisas.map((pesquisa) => (
              <div
                key={pesquisa.id}
                onClick={() => handlePesquisaClick(pesquisa)}
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  border: '1px solid #ccc',
                  margin: '5px 0',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <h3>{pesquisa.titulo}</h3>
                <p>Categoria: {pesquisa.cat_pes}</p>
                <p>Sobre: {pesquisa.sobre}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      <div >
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedPesquisa && (
          <div style={{ fontFamily:'Outfit'}}>
            <h2>{selectedPesquisa.titulo}</h2>
            <p>Categoria: {selectedPesquisa.cat_pes}</p>
            <p>Sobre: {selectedPesquisa.sobre}</p>
            <button className='buttonSubmitPerg' onClick={handleNavigate} style={{ fontFamily:'Outfit'}}>Ir para pesquisa</button>
          </div>
          
        )}
      </Modal>
      </div>
    </>
  );
};

export default PesquisasPage;
