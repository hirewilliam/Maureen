const CACHE = 'care-hub-v3';
const STATIC = ['./icon-192.png', './icon-512.png', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always fetch HTML fresh from network — never serve from cache
  if (e.request.destination === 'document' || e.request.url.endsWith('.html')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Static assets: network first, fall back to cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
