const CACHE_NAME = 'descarte-certo-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }

        // Se não estiver no cache, buscar da rede
        return fetch(event.request)
          .then((response) => {
            // Verificar se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para páginas offline
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Notificações push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Descarte Certo!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver mais',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Descarte Certo', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Apenas fechar a notificação
  } else {
    // Clique padrão
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Função para sincronização em background
async function doBackgroundSync() {
  try {
    // Sincronizar dados offline
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      // Enviar dados para o servidor
      for (const data of offlineData) {
        await syncDataToServer(data);
      }
      
      // Limpar dados offline
      await clearOfflineData();
    }
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}

// Funções auxiliares para dados offline
async function getOfflineData() {
  // Implementar busca de dados offline do IndexedDB
  return [];
}

async function syncDataToServer(data) {
  // Implementar envio de dados para o servidor
  return fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
}

async function clearOfflineData() {
  // Implementar limpeza de dados offline
} 