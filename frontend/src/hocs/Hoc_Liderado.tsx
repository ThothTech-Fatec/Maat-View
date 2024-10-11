import React from 'react';
import { Navigate } from 'react-router-dom';

const LideradoRole = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const userRole = localStorage.getItem('userRole');

    if (userRole !== 'Liderado') {
      return <Navigate to="/unauthorized" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default LideradoRole;
