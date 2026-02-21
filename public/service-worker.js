/**
 * @file Service Worker 实现
 * @description 处理缓存策略、离线支持和后台同步
 * @module service-worker
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

const CACHE_NAME = 'yyc3-cache-v1';
const CACHE_VERSION = 1;

const CACHE_STRATEGIES = {
  'cache-first': async (request, cacheName, maxAge, maxEntries) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      const cacheDate = cachedResponse.headers.get('date');
      if (cacheDate) {
        const age = Date.now() - new Date(cacheDate).getTime();
        if (age < maxAge) {
          return cachedResponse;
        }
      }
    }
    
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
        await enforceCacheSize(cacheName, maxEntries);
      }
      return networkResponse;
    } catch {
      return cachedResponse || new Response('Offline', { status: 503 });
    }
  },
  
  'network-first': async (request, cacheName, maxAge, maxEntries) => {
    const cache = await caches.open(cacheName);
    
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
        await enforceCacheSize(cacheName, maxEntries);
      }
      return networkResponse;
    } catch {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      return new Response('Offline', { status: 503 });
    }
  },
  
  'cache-only': async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Not Found', { status: 404 });
  },
  
  'network-only': async (request) => {
    try {
      return await fetch(request);
    } catch {
      return new Response('Network Error', { status: 503 });
    }
  },
  
  'stale-while-revalidate': async (request, cacheName, maxAge, maxEntries) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    const networkPromise = fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
        await enforceCacheSize(cacheName, maxEntries);
      }
      return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse ? cachedResponse : await networkPromise;
  }
};

const enforceCacheSize = async (cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    const keysToDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
};

const matchStrategy = (request, strategies) => {
  for (const strategy of strategies) {
    let matches = false;
    
    if (typeof strategy.urlPattern === 'string') {
      matches = request.url.includes(strategy.urlPattern);
    } else if (strategy.urlPattern instanceof RegExp) {
      matches = strategy.urlPattern.test(request.url);
    } else if (strategy.urlPattern instanceof URLPattern) {
      matches = strategy.urlPattern.test(request.url);
    }
    
    if (matches) {
      return strategy;
    }
  }
  
  return null;
};

const defaultStrategies = [
  {
    name: 'static-assets',
    urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/,
    strategy: 'cache-first',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    maxEntries: 100
  },
  {
    name: 'api-responses',
    urlPattern: /^\/api\//,
    strategy: 'network-first',
    maxAge: 5 * 60 * 1000,
    maxEntries: 50
  },
  {
    name: 'html-pages',
    urlPattern: /\.(?:html)$/,
    strategy: 'stale-while-revalidate',
    maxAge: 24 * 60 * 60 * 1000,
    maxEntries: 20
  }
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.method !== 'GET') {
    return;
  }
  
  const strategy = matchStrategy(request, defaultStrategies);
  
  if (strategy) {
    event.respondWith(
      CACHE_STRATEGIES[strategy.strategy](
        request,
        `${CACHE_NAME}-${strategy.name}`,
        strategy.maxAge,
        strategy.maxEntries
      )
    );
  } else {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          return cachedResponse || caches.match('/offline.html');
        });
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      caches.keys().then(async (cacheNames) => {
        let totalSize = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
        }
        
        event.ports[0].postMessage({ totalSize });
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_ENTRIES') {
    event.waitUntil(
      caches.keys().then(async (cacheNames) => {
        const entries = [];
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              entries.push({
                url: request.url,
                cacheName,
                size: parseInt(response.headers.get('content-length') || '0', 10),
                date: response.headers.get('date')
              });
            }
          }
        }
        
        event.ports[0].postMessage({ entries });
      })
    );
  }
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Default notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open('background-sync-cache');
          const requests = await cache.keys();
          
          for (const request of requests) {
            try {
              const response = await fetch(request);
              if (response.ok) {
                await cache.delete(request);
              }
            } catch (error) {
              console.error('Background sync failed for:', request.url, error);
            }
          }
        } catch (error) {
          console.error('Background sync error:', error);
        }
      })()
    );
  }
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'periodic-sync') {
    event.waitUntil(
      (async () => {
        try {
          const clients = await self.clients.matchAll();
          clients.forEach((client) => {
            client.postMessage({
              type: 'PERIODIC_SYNC',
              timestamp: Date.now()
            });
          });
        } catch (error) {
          console.error('Periodic sync error:', error);
        }
      })()
    );
  }
});

const handleBackgroundSync = async (request) => {
  const cache = await caches.open('background-sync-cache');
  await cache.put(request, await fetch(request));
};

const handlePeriodicSync = async () => {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'PERIODIC_SYNC',
      timestamp: Date.now()
    });
  });
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

export default null;
