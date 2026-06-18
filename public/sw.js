/* Building QR service worker — runtime caching so the app installs and works
   offline after the first visit. No precache manifest needed (works with
   hashed asset names). */
const CACHE = 'building-qr-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // only cache same-origin

  // SPA navigations: serve cached shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put('/', res.clone());
          return res;
        } catch {
          const cache = await caches.open(CACHE);
          return (await cache.match(req)) || (await cache.match('/')) || Response.error();
        }
      })(),
    );
    return;
  }

  // Static assets: cache-first with background refresh (stale-while-revalidate).
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })(),
  );
});
