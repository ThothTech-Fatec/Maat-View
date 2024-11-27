import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RenderMenu from '../../components/Render_Menu';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import '../../static/SuasAvaliacoes.css';
import DashboardLider from '../../components/GraficoLider';
import GDashboardADM from '../../components/GraficoADM';
import AdminRole from '../../hocs/Hoc_Admin';

interface Pesquisa {
  id: number;
  titulo: string;
  sobre: string;
  cat_pes: string;
  avaliacoes_pendentes: number;
}

const DashboardADM: React.FC = () => {

  return (
    <>
      <RenderMenu />
      <div className='content-container4' style={{marginTop: '1%'}}>
        <div style={{width: '100%'}}>
          <h1>Dashboard Geral</h1>
          <GDashboardADM />
        </div>
      </div>
    </>
  );
};

export default AdminRole(DashboardADM);