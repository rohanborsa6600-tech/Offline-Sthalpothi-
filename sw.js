const CACHE_NAME = 'sthal-pothi-cache-v1';
const urlsToCache = [
  'sthal_pothi_glass_ui.html',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Tiro+Devanagari+Marathi:wght@400;700&display=swap',
  // Add other font files if the CSS @import brings in more
  'https://fonts.gstatic.com/s/tirodevanagarimarathi/v6/XRXB3_b4wMvA4a-23S-y-f-b-8-g-gsvX9w.woff2',
  'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        const requests = urlsToCache.map(url => new Request(url, { mode: 'cors' }));
        return Promise.all(requests.map(req => 
          fetch(req).then(response => {
            if(response.ok) {
              return cache.put(req, response);
            }
          })
        ));
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            if(!response || response.status !== 200) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

