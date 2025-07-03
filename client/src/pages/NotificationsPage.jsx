import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaCheck, 
  FaTrash, 
  FaStar, 
  FaTrophy, 
  FaGift, 
  FaUsers, 
  FaChartLine,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes,
  FaFilter,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaRocket,
  FaLeaf,
  FaRecycle,
  FaMedal,
  FaCrown,
  FaGem,
  FaFire,
  FaHeart,
  FaLightbulb,
  FaHandshake,
  FaCalendarCheck,
  FaBullhorn,
  FaShieldAlt,
  FaCog
} from 'react-icons/fa';
import { notificationService } from '../services';
import { Loading } from '../components/ui/Loading';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setNotifications([]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkAsRead = async (id) => {
    // Simular API call
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = async (id) => {
    // Simular API call
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'achievement': return 'text-yellow-600 dark:text-yellow-400';
      case 'points': return 'text-blue-600 dark:text-blue-400';
      case 'challenge': return 'text-purple-600 dark:text-purple-400';
      case 'reward': return 'text-green-600 dark:text-green-400';
      case 'ranking': return 'text-orange-600 dark:text-orange-400';
      case 'reminder': return 'text-gray-600 dark:text-gray-400';
      case 'social': return 'text-pink-600 dark:text-pink-400';
      case 'system': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeBg = (type) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'points': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'challenge': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'reward': return 'bg-green-100 dark:bg-green-900/20';
      case 'ranking': return 'bg-orange-100 dark:bg-orange-900/20';
      case 'reminder': return 'bg-gray-100 dark:bg-gray-700';
      case 'social': return 'bg-pink-100 dark:bg-pink-900/20';
      case 'system': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days} dias atrás`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <Loading text="Carregando notificações..." />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 px-1 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
            <FaBell className="text-2xl sm:text-4xl text-blue-500" />
            Notificações
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Mantenha-se atualizado sobre suas atividades, conquistas e novidades
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="text-center p-2 sm:p-4">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <FaBell className="text-lg sm:text-xl text-blue-500" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total</p>
          </Card>
          <Card className="text-center p-2 sm:p-4">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <FaEye className="text-lg sm:text-xl text-green-500" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Não lidas</p>
          </Card>
          <Card className="text-center p-2 sm:p-4">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <FaTrophy className="text-lg sm:text-xl text-yellow-500" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.filter(n => n.type === 'achievement').length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Conquistas</p>
          </Card>
          <Card className="text-center p-2 sm:p-4">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <FaGift className="text-lg sm:text-xl text-purple-500" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.filter(n => n.type === 'reward').length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Recompensas</p>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 justify-between items-center text-xs sm:text-base">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors text-xs sm:text-base ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors text-xs sm:text-base ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors text-xs sm:text-base ${
                filter === 'read'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Lidas ({notifications.length - unreadCount})
            </button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleMarkAllAsRead}
              variant="secondary"
              size="xs"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base"
            >
              <FaCheck />
              Marcar todas como lidas
            </Button>
            <Button
              onClick={handleDeleteAll}
              variant="danger"
              size="xs"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-base"
            >
              <FaTrash />
              Limpar todas
            </Button>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {filteredNotifications.length === 0 ? (
            <Card className="text-center py-8 sm:py-12">
              <FaBell className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                {filter === 'unread' 
                  ? 'Você não tem notificações não lidas.'
                  : filter === 'read'
                  ? 'Você não tem notificações lidas.'
                  : 'Nenhuma notificação encontrada.'
                }
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-3 sm:p-6 transition-all duration-300 hover:shadow-lg rounded-xl sm:rounded-2xl flex flex-col gap-2 sm:gap-4 ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-700 opacity-75' 
                      : 'bg-white dark:bg-gray-800 ring-2 ring-blue-500'
                  }`}>
                    <div className="flex gap-2 sm:gap-4 items-start">
                      {/* Ícone */}
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${getTypeBg(notification.type)}`}>
                        <Icon className={`text-lg sm:text-xl ${getTypeColor(notification.type)}`} />
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base mb-2 sm:mb-3">
                              {notification.message}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              <span className={`px-2 py-1 rounded-full font-medium ${getTypeBg(notification.type)} ${getTypeColor(notification.type)}`}
                                style={{ fontSize: '0.7rem' }}>
                                {notification.type}
                              </span>
                              <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(notification.priority)}`}
                                style={{ fontSize: '0.7rem' }}>
                                {notification.priority}
                              </span>
                            </div>
                          </div>

                          {/* Ações */}
                          <div className="flex flex-col gap-2 items-end">
                            {!notification.read && (
                              <Button
                                onClick={() => handleMarkAsRead(notification.id)}
                                variant="secondary"
                                size="xs"
                                className="px-2 py-1 text-xs"
                              >
                                <FaCheck className="mr-1" /> Lida
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDelete(notification.id)}
                              variant="danger"
                              size="xs"
                              className="px-2 py-1 text-xs"
                            >
                              <FaTrash className="mr-1" /> Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage; 