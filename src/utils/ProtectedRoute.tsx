import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isLoggedIn);
  const location = useLocation();
  
  return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;