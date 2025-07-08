import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome, FaQrcode, FaGift, FaTrophy, FaChartBar, FaHistory, FaCog, FaUser, FaBell, FaHeadset, FaSignOutAlt, FaLeaf, FaMoon, FaSun, FaBars, FaTimes, FaCalendarAlt, FaUsers, FaSmile, FaBook, FaMapMarkerAlt
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useAppState } from '../../hooks/useAppState';
import Button from './Button';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useAppState();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome, path: '/dashboard' },
    { id: 'collect-points', label: 'Coletar Pontos', icon: FaQrcode, path: '/collect-points' },
    { id: 'coleta-agendada', label: 'Coleta Agendada', icon: FaCalendarAlt, path: '/coleta-agendada' },
    { id: 'rewards', label: 'Recompensas', icon: FaGift, path: '/recompensas' },
    { id: 'ranking', label: 'Ranking', icon: FaChartBar, path: '/ranking' },
    { id: 'history', label: 'Histórico', icon: FaHistory, path: '/historico' },
    { id: 'profile', label: 'Perfil', icon: FaUser, path: '/perfil' },
    { id: 'notifications', label: 'Notificações', icon: FaBell, path: '/notificacoes' },
    { id: 'support', label: 'Suporte', icon: FaHeadset, path: '/suporte' },
    { id: 'feedback', label: 'Feedback', icon: FaSmile, path: '/feedback' },
    { id: 'educacao-ambiental', label: 'Educação Ambiental', icon: FaBook, path: '/educacao-ambiental' },
    { id: 'settings', label: 'Configurações', icon: FaCog, path: '/configuracoes' },
    { id: 'sobre-equipe', label: 'Sobre a Equipe', icon: FaUsers, path: '/sobre-nos' },
    { id: 'sobre-projeto', label: 'Sobre o Projeto', icon: FaLeaf, path: '/sobre-projeto' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fechar sidebar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Listener para o botão da navbar
  useEffect(() => {
    const handleToggleSidebar = () => {
      console.log('Botão da navbar clicado!'); // Debug
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/4 xl:w-1/5 max-w-sm bg-white dark:bg-gray-900 shadow-lg z-50 sidebar flex flex-col"
            style={{ minWidth: '280px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FaLeaf className="text-2xl text-green-600" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">Descarte Certo</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-600"
                aria-label="Fechar menu"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            {/* Menu */}
            <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-green-200 dark:scrollbar-thumb-green-900">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors text-base ${
                      isActive
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Footer */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <>
                  <div className="mb-3">
                    <p className="text-base font-medium text-gray-900 dark:text-white truncate">{user?.name || 'Usuário'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={toggleTheme}
                      className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-600"
                      aria-label="Alternar tema"
                    >
                      {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-3 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                      aria-label="Sair"
                    >
                      <FaSignOutAlt size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={toggleTheme}
                    className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-600"
                    aria-label="Alternar tema"
                  >
                    {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
                  </button>
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="w-full">Entrar</Button>
                  </Link>
                  <Link to="/cadastro">
                    <Button variant="primary" size="sm" className="w-full">Cadastrar</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar; 