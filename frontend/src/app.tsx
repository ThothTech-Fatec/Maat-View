import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import MinhasInfo from './pages/MinhasInfo';
import CadastroUser from './pages/Admin/CadastroUser';
import ExibeUser from './pages/Admin/ExibeUser';
import Unauthorized from './pages/Unauthorized';
import CadastroAsk from './pages/Admin/CadastroAsk';
import ExibePesq from './pages/Admin/ExibePesq';
import VerPergs from './pages/Admin/verPergs';



const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />  {}
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/minhas_info" element={<MinhasInfo />} />
                <Route path="/cadastro_de_user" element={<CadastroUser />} />
                <Route path="/cadastro_de_ask" element={<CadastroAsk />} />
                <Route path="/exibe_user" element={<ExibeUser />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/exibe_search" element={<ExibePesq />} />
                <Route path="/ver-Pergs" element={<VerPergs />} />
                <Route path="/ver-Pergs/:id" element={<VerPergs />} />  {/* Rota com parâmetro */}


                {}
            </Routes>
        </Router>
    );
};

export default App;
