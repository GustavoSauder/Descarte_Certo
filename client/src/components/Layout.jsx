import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLeaf, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks';
import { useAppState } from '../hooks';
import { NotificationContainer } from './ui/Notification';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';
import Sidebar from './ui/Sidebar';

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { theme, notifications, removeNotification } = useAppState();
  const location = useLocation();

  // Debug: Log do estado de autenticação
  useEffect(() => {
    console.log('Layout - Estado de autenticação:', { isAuthenticated, user, loading });
  }, [isAuthenticated, user, loading]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = () => {
    logout();
  };

  const handleToggleSidebar = () => {
    console.log('Botão da sidebar clicado!'); // Debug
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Header */}
      <header className="w-full shadow bg-green-700 dark:bg-green-900 sticky top-0 z-40">
        <nav className="w-full flex items-center justify-between pt-[10px] pb-[16px] relative px-4">
          {/* Botão da Sidebar - Canto esquerdo */}
          <button
            onClick={handleToggleSidebar}
            className="p-2 text-white hover:bg-green-600 rounded-lg transition-colors"
            aria-label="Abrir menu"
            tabIndex={0}
          >
            <FaBars size={20} />
          </button>

          {/* Título centralizado */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <Link to="/" className="flex items-center gap-1 text-xl font-bold text-white hover:text-green-100 transition-colors min-w-max whitespace-nowrap">
              <FaLeaf className="text-2xl" />
              <span className="hidden sm:inline">Descarte Certo</span>
              <span className="sm:hidden">DC</span>
            </Link>
          </div>

          {/* Lado direito: Botões do Header */}
          <div className="flex items-center gap-1">
            {/* Autenticação */}
            {!loading && (
              <>
                {!isAuthenticated ? (
                  <>
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-green-700 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-green-700 ml-2">
                        {t('login')}
                      </Button>
                    </Link>
                    <Link to="/cadastro">
                      <Button variant="primary" size="sm" className="text-white bg-green-600 hover:bg-green-700 dark:text-white dark:bg-green-600 dark:hover:bg-green-700 font-medium shadow-md border border-white">
                        {t('register')}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-green-700 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-green-700 ml-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="inline mr-1" /> {t('logout')}
                  </Button>
                )}
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="w-full px-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 Descarte Certo. {t('developer_credit')}</p>
          </div>
        </div>
      </footer>

      {/* Notificações */}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </div>
  );
} 