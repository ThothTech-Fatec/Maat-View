import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MinhasInfo from './pages/MinhasInfo';
import CadastroUser from './pages/Admin/CadastroUser';
import ExibeUser from './pages/Admin/ExibeUser';
import Unauthorized from './pages/Unauthorized';
import CadastroAsk from './pages/Admin/CadastroAsk';
import ExibePesq from './pages/Admin/ExibePesq';
import VerPergs from './pages/Admin/verPergs';
import PesquisasPage from './pages/SuasAvaliações';
import FormularioPesquisa from './pages/Formulário';
import ExibirLiderados from './pages/Líder/ExibirLiderados';
import DashboardLR from './pages/Liderado/DashboardLR';
import DashboardLD from './pages/Líder/DashboardLD';
import DashboardADM from './pages/Admin/DashboardADM';



const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />  {}
                <Route path="/login" element={<Login />} />
                <Route path="/minhas_info" element={<MinhasInfo />} />
                <Route path="/cadastro_de_user" element={<CadastroUser />} />
                <Route path="/cadastro_de_ask" element={<CadastroAsk />} />
                <Route path="/exibe_user" element={<ExibeUser />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/exibe_search" element={<ExibePesq />} />
                <Route path="/ver-Pergs" element={<VerPergs />} />
                <Route path="/ver-Pergs/:id" element={<VerPergs />} />  {/* Rota com parâmetro */}
                <Route path="/minhas_avaliaçoes" element={<PesquisasPage />} />
                <Route path="/pesquisa/:pesquisaId" element={<FormularioPesquisa />} />
                <Route path="/exibir_liderados" element={<ExibirLiderados />} />
                <Route path="/dashboardlr" element={<DashboardLR />} />
                <Route path="/dashboardld" element={<DashboardLD />} />
                <Route path="/dashboardadm" element={<DashboardADM />} />



                {}
            </Routes>
        </Router>
    );
};

export default App;
