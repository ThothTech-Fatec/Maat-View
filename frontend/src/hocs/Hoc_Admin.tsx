import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRole = (WrappedComponent: React.FC) => {
  return (props: any) => {
    const userRole = localStorage.getItem('userRole'); // Pegamos o cargo com base no token guardado

    if (userRole !== 'Admin') {
      return <Navigate to="/unauthorized" />; // Redireciona para a página de não autorizado
    }

    // Retorna o componente envolto se o usuário for admin
    return <WrappedComponent {...props} />;
  };
};

export default AdminRole;
