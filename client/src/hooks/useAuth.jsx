import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Iniciando verificação de sessão');
    
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('AuthProvider: Usuário carregado do localStorage:', userData);
      } catch (error) {
        console.error('AuthProvider: Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      console.log('signUp: Tentando cadastrar usuário:', email);
      
      // Simular cadastro local
      const newUser = {
        id: Date.now(),
        email,
        name: userData?.name || email.split('@')[0],
        school: userData?.school || null,
        grade: userData?.grade || null,
        role: 'USER',
        points: 0,
        level: 1,
        createdAt: new Date().toISOString()
      };
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      console.log('signUp: Usuário cadastrado:', newUser);
      return { data: { user: newUser }, error: null };
    } catch (error) {
      console.error('signUp: Erro:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('signIn: Tentando fazer login com:', email);
      
      // Simular login local - aceitar qualquer email/senha para teste
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        school: null,
        grade: null,
        role: 'USER',
        points: 100,
        level: 1,
        createdAt: new Date().toISOString()
      };
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('signIn: Usuário logado:', userData);
      return { data: { user: userData }, error: null };
    } catch (error) {
      console.error('signIn: Erro no login:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('signOut: Tentando fazer logout');
      
      // Remover do localStorage
      localStorage.removeItem('user');
      setUser(null);
      
      console.log('signOut: Logout realizado com sucesso');
    } catch (error) {
      console.error('signOut: Erro ao fazer logout:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      console.log('resetPassword: Reset de senha para:', email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (password) => {
    try {
      console.log('updatePassword: Senha atualizada');
      return { error: null };
    } catch (error) {
      return { error };
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