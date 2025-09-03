import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../shared/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    // TODO: Implement actual login logic
    // For now, return mock success
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData: any): Promise<boolean> => {
    // TODO: Implement actual registration logic
    // For now, return mock success
    return true;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
