import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { FaLeaf, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useAppState } from '../hooks';
import { NotificationContainer } from './ui/Notification';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';
import Sidebar from './ui/Sidebar';
import RealTimeNotification from './RealTimeNotification';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Loading } from './ui/Loading';

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { isAuthenticated, user, signOut, loading } = useAuth();
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
    signOut();
  };

  const handleToggleSidebar = () => {
    console.log('Botão da sidebar clicado!'); // Debug
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />
      {/* Header */}
      <header className="w-full shadow bg-green-700 dark:bg-green-900 sticky top-0 z-40">
        <nav className="w-full flex items-center justify-between pt-2 pb-3 relative px-2 sm:px-4">
          {/* Botão da Sidebar - Canto esquerdo */}
          <button
            onClick={handleToggleSidebar}
            className="p-2 text-white hover:bg-green-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Abrir menu"
            tabIndex={0}
          >
            <FaBars size={20} />
          </button>

          {/* Título centralizado - responsivo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            <Link to="/" className="flex items-center gap-1 text-base sm:text-xl font-bold text-white hover:text-green-100 transition-colors min-w-max whitespace-nowrap">
              <FaLeaf className="text-lg sm:text-2xl" />
              <span className="block text-xs sm:text-xl">Descarte Certo</span>
            </Link>
          </div>

          {/* Lado direito: Botões do Header - responsivo */}
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-1 items-end sm:items-center min-w-[80px]">
            {/* Autenticação */}
            {!loading && (
              <>
                {!isAuthenticated ? (
                  <>
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-green-700 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-green-700 px-2 sm:px-3 py-1 sm:py-1 text-xs sm:text-sm w-full sm:w-auto">
                        {t('login')}
                      </Button>
                    </Link>
                    <Link to="/cadastro">
                      <Button variant="primary" size="sm" className="text-white bg-green-600 hover:bg-green-700 dark:text-white dark:bg-green-600 dark:hover:bg-green-700 font-medium shadow-md border border-white px-2 sm:px-3 py-1 sm:py-1 text-xs sm:text-sm w-full sm:w-auto">
                        {t('register')}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-green-700 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-green-700 px-2 sm:px-3 py-1 sm:py-1 text-xs sm:text-sm w-full sm:w-auto"
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
      <main className="flex-1 w-full max-w-full px-2 sm:px-4 py-2 sm:py-4 mx-auto overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-3 sm:py-4 px-2 sm:px-4">
        <div className="w-full">
          <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 Descarte Certo. {t('developer_credit')}</p>
          </div>
        </div>
      </footer>

      {/* Notificações */}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </div>
  );
} 