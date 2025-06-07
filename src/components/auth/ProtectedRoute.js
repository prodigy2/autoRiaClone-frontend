import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Utente non autenticato, reindirizza al login
    return <Navigate to="/login" replace />;
  }

  // Utente autenticato, mostra il contenuto protetto
  return children;
};

export default ProtectedRoute;
