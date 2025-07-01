import React, { useState, useEffect } from 'react';
import { FaSync, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RealTimeNotification = ({ 
  isOnline, 
  lastUpdate, 
  isSyncing = false, 
  onClose, 
  message = null 
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('info');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (message) {
      setNotificationMessage(message);
      setNotificationType('info');
      setShowNotification(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (isSyncing) {
      setNotificationMessage('Sincronizando dados em tempo real...');
      setNotificationType('syncing');
      setShowNotification(true);
    } else if (isOnline && lastUpdate) {
      setNotificationMessage(`Dados atualizados em ${lastUpdate.toLocaleTimeString('pt-BR')}`);
      setNotificationType('success');
      setShowNotification(true);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, lastUpdate, isSyncing]);

  const getIcon = () => {
    switch (notificationType) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'syncing':
        return <FaSync className="text-blue-500 animate-spin" />;
      default:
        return <FaCheckCircle className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (notificationType) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'syncing':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const handleClose = () => {
    setShowNotification(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg ${getBgColor()}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {notificationMessage}
              </p>
              {isOnline && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Conectado em tempo real
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealTimeNotification; 