import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface PrivateWrapperProps {
  children: JSX.Element;
}

const PrivateWrapper: React.FC<PrivateWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Render children if authenticated; otherwise, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateWrapper;
