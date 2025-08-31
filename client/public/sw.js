const CACHE_NAME = 'roome-v1';
const STATIC_CACHE = 'roome-static-v1';
const DYNAMIC_CACHE = 'roome-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/listings/,
  /^\/api\/services/,
  /^\/api\/auth\/user/
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static files');
      return cache.addAll(STATIC_FILES);
    }).catch((error) => {
      console.error('Service Worker: Cache installation failed', error);
    })
  );
  
  // Force activation
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control immediately
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log('Service Worker: Serving from cache', request.url);
        return cachedResponse;
      }
      
      // Fetch from network
      return fetch(request).then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Determine cache strategy
        const shouldCacheAPI = API_CACHE_PATTERNS.some(pattern => 
          pattern.test(url.pathname)
        );
        
        if (shouldCacheAPI) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            console.log('Service Worker: Caching API response', request.url);
            cache.put(request, responseToCache);
          });
        } else if (url.origin === self.location.origin) {
          caches.open(STATIC_CACHE).then((cache) => {
            console.log('Service Worker: Caching static resource', request.url);
            cache.put(request, responseToCache);
          });
        }
        
        return response;
      }).catch((error) => {
        console.error('Service Worker: Fetch failed', error);
        
        // Return offline fallback for navigation requests
        if (request.destination === 'document') {
          return caches.match('/') || new Response(
            '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your connection and try again.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
        
        // Return generic offline response for other requests
        return new Response(
          JSON.stringify({ error: 'Offline', message: 'You are currently offline' }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync offline actions stored in IndexedDB
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // Remove successful action
        await removeOfflineAction(action.id);
        console.log('Service Worker: Synced offline action', action.id);
      } catch (error) {
        console.error('Service Worker: Failed to sync action', action.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.error('Service Worker: Failed to parse push data', error);
    }
  }
  
  const options = {
    title: data.title || 'RooMe Notification',
    body: data.body || 'You have a new notification',
    icon: '/api/placeholder/192/192',
    badge: '/api/placeholder/72/72',
    tag: data.tag || 'default',
    data: data,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/api/placeholder/24/24'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/api/placeholder/24/24'
      }
    ],
    requireInteraction: false,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'RooMe', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Helper functions for IndexedDB operations
async function getOfflineActions() {
  // Implementation would use IndexedDB to store/retrieve offline actions
  return [];
}

async function removeOfflineAction(id) {
  // Implementation would remove action from IndexedDB
  return true;
}

// Utility function to clean old caches
async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name !== STATIC_CACHE && name !== DYNAMIC_CACHE
  );
  
  await Promise.all(
    oldCaches.map(name => caches.delete(name))
  );
}

// Periodic cache cleanup
setInterval(cleanOldCaches, 24 * 60 * 60 * 1000); // 24 hours
