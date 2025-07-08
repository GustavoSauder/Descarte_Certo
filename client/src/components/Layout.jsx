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
            <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-green-100 transition-colors min-w-max whitespace-nowrap">
              <FaLeaf className="text-2xl sm:text-3xl md:text-4xl" />
              <span className="block text-lg sm:text-2xl md:text-3xl">Descarte Certo</span>
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
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 sm:py-8 px-2 sm:px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6">
            {/* Logo e Descrição */}
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <FaLeaf className="text-2xl text-green-600" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">Descarte Certo</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Transformando o descarte em pontos, conquistas e impacto ambiental real. 
                Juntos por um futuro mais sustentável.
              </p>
            </div>
            
            {/* Links Rápidos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/sobre-nos" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Sobre a Equipe
                  </Link>
                </li>
                <li>
                  <Link to="/sobre-projeto" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Sobre o Projeto
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Baixar App
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Suporte */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/suporte" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link to="/cadastro" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Cadastre-se
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    Entrar
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <p>&copy; 2025 Descarte Certo. {t('developer_credit')}</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Notificações */}
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
    </div>
  );
} 