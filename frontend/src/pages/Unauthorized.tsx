import React from 'react';
import logo from '../static/logo.png';

const Unauthorized: React.FC = () => {
  return (
    <body className='login-body'>
    <div className='container'>
        <div style={{ marginBottom: 150 }}>
            <img src={logo} alt="Logo" style={{ display: 'block', width: '350px' }} />
            <h1 className='outfitTitle' style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>Acesso Não Autorizado</h1>
            <div className="form-container">
                
            </div>

        </div>
    </div>
</body>
  );
};

export default Unauthorized;
