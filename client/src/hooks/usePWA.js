import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar se PWA é suportado
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);

    // Verificar se já está instalado
    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkIfInstalled();

    // Listener para evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listener para status online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listener para mudança de display mode
    const handleDisplayModeChange = () => {
      checkIfInstalled();
    };

    // Adicionar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registrado:', registration);
        })
        .catch((error) => {
          console.log('SW falhou:', error);
        });
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // Função para instalar PWA
  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('Prompt de instalação não disponível');
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA instalado com sucesso');
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('Instalação cancelada pelo usuário');
        return false;
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      return false;
    }
  };

  // Função para solicitar permissão de notificações
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Notificações não suportadas');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('Permissão de notificação negada');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  // Função para enviar notificação
  const sendNotification = (title, options = {}) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
  };

  // Função para sincronizar dados offline
  const syncOfflineData = async () => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
        console.log('Sincronização em background registrada');
        return true;
      } catch (error) {
        console.error('Erro ao registrar sincronização:', error);
        return false;
      }
    }
    return false;
  };

  // Função para verificar atualizações
  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        console.log('Verificação de atualização concluída');
        return true;
      } catch (error) {
        console.error('Erro ao verificar atualizações:', error);
        return false;
      }
    }
    return false;
  };

  return {
    isInstalled,
    isOnline,
    isSupported,
    canInstall: !!deferredPrompt,
    installPWA,
    requestNotificationPermission,
    sendNotification,
    syncOfflineData,
    checkForUpdates
  };
}; 