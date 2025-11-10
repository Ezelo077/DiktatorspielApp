const CACHE_NAME = 'diktator-v1';
const ASSETS = [
  '/DiktatorspielApp/',
  '/DiktatorspielApp/index.html',
  '/DiktatorspielApp/style.css',
  '/DiktatorspielApp/script.js',
  '/DiktatorspielApp/Desk.jpg',
  '/DiktatorspielApp/manifest.webmanifest',
  '/DiktatorspielApp/icons/icon-192.png',
  '/DiktatorspielApp/icons/icon-512.png'
];

// install
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// activate (alte Caches löschen)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// fetch: Cache first, Netzwerk Fallback
self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      // Optional: dynamisch cachen
      return res;
    }).catch(() => cached))
  );
});
