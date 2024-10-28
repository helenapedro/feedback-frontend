import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isLoggedIn);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
