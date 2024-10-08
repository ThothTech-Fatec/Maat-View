import React, { useEffect, useState } from 'react';
import ResponsiveMenu from '../components/ResponsiveMenu'; 

const MinhasInfo: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedRole = localStorage.getItem('userRole');

        if (storedEmail) {
            setEmail(storedEmail);
        }

        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    return (
        <div>
            <ResponsiveMenu />
            <div className='container'>
                <div className='Bordada outfitTexto'>
                    <h2 style={{textAlign: 'center'}}>Minhas Informações</h2>
                    <textarea
                        className='resizeTextA'
                        readOnly
                        value={`Email: ${email || 'Não disponível'}`}
                        rows={1}
                        style={{
                            width: '80%',
                            padding: '10px',
                            border: '1px solid #000',
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f5',
                            resize: `none`,
                            
                        }}
                    />
                    <textarea
                        className='resizeTextA'
                        readOnly
                        value={`Nível de acesso: ${role || 'Não disponível'}`}
                        rows={1}
                        style={{
                            width: '80%',
                            padding: '10px',
                            border: '1px solid #000',
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f5',
                            resize: `none`,
                            marginTop: '5px'
                        }}
                    />
                </div>
                
            </div>
        </div>
    );
};

export default MinhasInfo;
