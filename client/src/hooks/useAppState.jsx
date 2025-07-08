import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState deve ser usado dentro de um AppStateProvider');
  }
  return context;
};

export const AppStateProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Detectar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'system'; // 'system', 'light', 'dark'
  });

  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Detectar mudança na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (themeMode === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // Aplicar tema
  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('themeMode', themeMode);
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Atualizar meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1F2937' : '#10B981');
    }
  }, [theme, themeMode]);

  // Funções de controle de tema
  const setThemeModeAndTheme = (mode) => {
    setThemeMode(mode);
    
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(mode);
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'system') {
      setThemeModeAndTheme('light');
    } else if (theme === 'light') {
      setThemeModeAndTheme('dark');
    } else {
      setThemeModeAndTheme('light');
    }
  };

  // Adicionar notificação
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remover após 5 segundos se não for persistente
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
    
    return id;
  };

  // Remover notificação
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Limpar todas as notificações
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Alternar sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Fechar sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Função para mostrar loading
  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const value = {
    theme,
    themeMode,
    setThemeModeAndTheme,
    toggleTheme,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    loading,
    showLoading,
    hideLoading,
  };

  useEffect(() => {
    if (!user || !user.id) return;
    const updateOnline = async () => {
      await supabase
        .from('users')
        .update({ lastOnline: new Date().toISOString() })
        .eq('id', user.id);
    };
    updateOnline();
    const interval = setInterval(updateOnline, 30000); // a cada 30s
    return () => clearInterval(interval);
  }, [user && user.id]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}; 