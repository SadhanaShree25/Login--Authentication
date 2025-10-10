import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { AuthContextType, User } from '../types';
import { authService } from '../services/authService';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkUserSession = useCallback(async () => {
    try {
      const sessionUser = await authService.checkSession();
      if (sessionUser) {
        setUser(sessionUser);
      }
    } catch (e) {
      // Session check failed, user remains null
    } finally {
      setInitialLoading(false);
    }
  }, []);
  
  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      if (rememberMe) {
        localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      } else {
        sessionStorage.setItem('authUser', JSON.stringify(loggedInUser));
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const registeredUser = await authService.register(name, email, password);
      setUser(registeredUser);
      // By default, registration logs the user in for the session
      sessionStorage.setItem('authUser', JSON.stringify(registeredUser));
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    setError(null);
    authService.logout().then(() => {
      setUser(null);
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('authUser');
      setLoading(false);
    });
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, password);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    initialLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};