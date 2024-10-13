import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import MinhasInfo from './pages/MinhasInfo';
import CadastroUser from './pages/Admin/CadastroUser';
import ExibeUser from './pages/Admin/ExibeUser';
import Unauthorized from './pages/Unauthorized';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />  {}
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/minhas_info" element={<MinhasInfo />} />
                <Route path="/cadastro_de_user" element={<CadastroUser />} />
                <Route path="/exibe_user" element={<ExibeUser />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {}
            </Routes>
        </Router>
    );
};

export default App;
