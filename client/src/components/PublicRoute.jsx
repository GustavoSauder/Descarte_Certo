import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children, showLoginPrompt = false }) => {
  const { isAuthenticated } = useAuth();

  // Sempre retorna o conteúdo diretamente, sem avisos ou overlays
  return children;
};

export default PublicRoute; 