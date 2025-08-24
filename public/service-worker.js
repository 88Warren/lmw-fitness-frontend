const CACHE_NAME = 'lmw-fitness-v1';
const CACHE_FILES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/images/LMW_fitness_Hero_Image3.jpg',
  '/config.js',
  '/style.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/').then(cachedResponse => {
        return fetch(event.request).catch(() => cachedResponse);
      })
    );
  }
  // Handle API requests
  else if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('API temporarily unavailable', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
  }
  // Handle image requests from backend
  else if (event.request.url.includes('/images/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('Image temporarily unavailable', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
  }
  // Handle other static assets
  else {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});