const CACHE_NAME = 'kcs-guard-v18';
const ASSETS = [
  '/',
  '/css/main.css',
  '/css/base.css',
  '/css/components.css',
  '/css/sections.css',
  '/js/main.js',
  '/js/data.js',
  '/js/ui.js',
  '/js/modal.js',
  '/js/navigation.js',
  '/js/contact.js',
  '/js/carousel.js',
  '/manifest.json'
];

// Install Event - Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event - Serve from Cache, fallback to Network
self.addEventListener('fetch', (event) => {
  // Ignore API requests for caching
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
