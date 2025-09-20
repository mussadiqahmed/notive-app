import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkAuth, clearAuthData, refreshToken } from '../../../Backend/authStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { isAuthenticated: authStatus, user: userData } = await checkAuth();
      
      console.log('Auth status check:', { authStatus, user: userData?.email });
      
      if (authStatus && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Authentication check failed');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    setError(null);
  };

  const logout = async () => {
    try {
      await clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if clearing storage fails, we should still logout locally
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const refreshAuth = async () => {
    try {
      const result = await refreshToken();
      if (result.success) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return false;
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isLoading,
      error,
      login,
      logout,
      refreshAuth,
      updateUser,
      checkAuthenticationStatus
    }}>
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
