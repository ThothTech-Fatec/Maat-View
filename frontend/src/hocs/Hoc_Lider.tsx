import React from 'react';
import { Navigate } from 'react-router-dom';

const LiderRole = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const userRole = localStorage.getItem('userRole'); 
    if (userRole !== 'Líder') {
      return <Navigate to="/unauthorized" />;  
    }

    return <WrappedComponent {...props} />;
  };
};

export default LiderRole;
