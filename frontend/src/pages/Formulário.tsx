import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import RenderMenu from '../components/Render_Menu';

interface Pergunta {
  id: number;
  sobre: string;
  formato: 'Texto Longo' | 'Escolha Única' | 'Múltipla Escolha';
  opcoes?: Opcao[];
}

interface Opcao {
  id: number;
  texto: string;
}

interface Resposta {
  per_id: number;
  resp_texto: string | null;
  select_option_id: number | null;
}

const FormularioPesquisa: React.FC = () => {
  const { pesquisaId } = useParams<{ pesquisaId: string }>();
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('user_Id');

  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/verperguntas/${pesquisaId}`);
        setPerguntas(response.data);
        setRespostas(response.data.map((pergunta: Pergunta) => ({
          per_id: pergunta.id,
          resp_texto: pergunta.formato === 'Texto Longo' ? '' : null,
          select_option_id: null,
        })));
      } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
      }
    };

    if (pesquisaId) {
      fetchPerguntas();
    }
  }, [pesquisaId]);

  const handleTextChange = (id: number, text: string) => {
    setRespostas(prevRespostas => 
      prevRespostas.map(resposta => 
        resposta.per_id === id ? { ...resposta, resp_texto: text } : resposta
      )
    );
  };

  const handleOptionChange = (id: number, optionId: number) => {
    setRespostas(prevRespostas =>
      prevRespostas.map(resposta =>
        resposta.per_id === id ? { ...resposta, select_option_id: optionId } : resposta
      )
    );
  };

  const handleSubmit = async () => {
    // Verificação simples para garantir que todas as perguntas tenham respostas
    console.log({ respostas, userId });

    const allAnswered = respostas.every(resposta => 
      resposta.resp_texto !== null || resposta.select_option_id !== null
    );

    if (!allAnswered) {
      alert('Por favor, responda todas as perguntas.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/enviarrespostas`, { respostas, userId });
      alert('Respostas enviadas com sucesso!');
      navigate('/minhas_avaliacoes');
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
      alert('Ocorreu um erro ao enviar as respostas. Tente novamente.');
    }
  };

  return (
    <div>
      <RenderMenu />
      <div className="form-container" style={{ fontFamily: 'Outfit' }}>
        <h1>Pesquisa</h1>
        {perguntas.length > 0 ? (
          perguntas.map(pergunta => (
            <div key={pergunta.id} className="pergunta">
              <h3>{pergunta.sobre}</h3>
              {pergunta.formato === 'Texto Longo' ? (
                <textarea
                  value={respostas.find(resposta => resposta.per_id === pergunta.id)?.resp_texto || ''}
                  onChange={(e) => handleTextChange(pergunta.id, e.target.value)}
                  rows={4}
                />
              ) : (
                <div>
                  {pergunta.opcoes?.map(opcao => (
                    <label key={opcao.id} className="option-label" style={{ marginBottom: '5%' }}>
                      <div style={{ width: '90%' }}>{opcao.texto}</div>
                      <input
                        type={pergunta.formato === 'Escolha Única' ? 'radio' : 'checkbox'}
                        name={`pergunta_${pergunta.id}`}
                        value={opcao.id}
                        onChange={() => handleOptionChange(pergunta.id, opcao.id)}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Carregando perguntas...</p>
        )}
        <button onClick={handleSubmit} className='buttonSubmitPerg'>Enviar Respostas</button>
      </div>
    </div>
  );
};

export default FormularioPesquisa;
