import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verificar se o token ainda é válido
          const response = await apiRequest('/auth/verify', 'GET');
          if (response.success) {
            setUser(response.user);
          } else {
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('AuthProvider: Erro ao verificar sessão:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      console.log('signUp: Tentando cadastrar usuário:', email);
      
      const response = await apiRequest('/auth/register', 'POST', {
        name: userData?.name || email.split('@')[0],
        email,
        password,
        school: userData?.school || '',
        grade: userData?.grade || ''
      });
      
      if (response.success) {
        console.log('signUp: Usuário cadastrado com sucesso');
        return { data: response, error: null };
      } else {
        console.error('signUp: Erro no cadastro:', response.error);
        return { data: null, error: response.error };
      }
    } catch (error) {
      console.error('signUp: Erro:', error);
      return { data: null, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('signIn: Tentando fazer login com:', email);
      
      const response = await apiRequest('/auth/login', 'POST', {
        email,
        password
      });
      
      if (response.success) {
        // Salvar token no localStorage
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        console.log('signIn: Usuário logado com sucesso');
        return { data: response, error: null };
      } else {
        console.error('signIn: Erro no login:', response.error);
        return { data: null, error: response.error };
      }
    } catch (error) {
      console.error('signIn: Erro no login:', error);
      return { data: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      console.log('signOut: Tentando fazer logout');
      
      // Remover token do localStorage
      localStorage.removeItem('authToken');
      setUser(null);
      console.log('signOut: Logout realizado com sucesso');
    } catch (error) {
      console.error('signOut: Erro ao fazer logout:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      console.log('resetPassword: Reset de senha para:', email);
      
      const response = await apiRequest('/auth/reset-password', 'POST', { email });
      
      return { error: response.success ? null : response.error };
    } catch (error) {
      return { error: error.message };
    }
  };

  const updatePassword = async (password) => {
    try {
      console.log('updatePassword: Atualizando senha');
      
      const response = await apiRequest('/auth/update-password', 'PUT', { password });
      
      return { error: response.success ? null : response.error };
    } catch (error) {
      return { error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user
  };

  console.log('AuthProvider: Estado atual:', { user, loading, isAuthenticated: !!user });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 