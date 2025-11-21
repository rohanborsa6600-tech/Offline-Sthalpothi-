const CACHE_NAME = 'sthalpothi-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // जर तुमच्या प्रोजेक्टमध्ये css किंवा images असतील तर त्यांची नावे खाली ऍड करा:
  // './style.css',
  // './script.js',
  // './icon-192.png',
  // './icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker (Update Cache)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch (Serve Offline Content)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
