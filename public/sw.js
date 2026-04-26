// Service Worker for caching and fast updates

const CACHE_NAME = 'engleuphoria-v6';
const ASSETS = [
  '/',
  '/favicon.ico?v=5',
  '/favicon.png?v=5',
  '/icons/apple-touch-icon.png?v=5',
  '/icons/icon-192.png?v=5',
  '/icons/icon-512.png?v=5',
  '/icons/icon-512-maskable.png?v=5',
  '/placeholder.svg',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(cacheNames.map((name) => name !== CACHE_NAME && caches.delete(name)))
    )
  );
  self.clients.claim();
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    clients.forEach((client) => client.postMessage({ type: 'SW_ACTIVATED', cache: CACHE_NAME }));
  });
});

// Listen for SKIP_WAITING from the client to activate the new SW on demand
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Strategies
async function networkFirst(request) {
  try {
    const fresh = await fetch(request, { cache: 'no-store' });
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await caches.match(request);
  const fetchPromise = fetch(request)
    .then((res) => {
      cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const accept = request.headers.get('accept') || '';
  if (request.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  const dest = request.destination;
  const url = new URL(request.url);
  const isBrandIcon = url.pathname === '/favicon.ico'
    || url.pathname === '/favicon.png'
    || url.pathname === '/og-image.png'
    || url.pathname.startsWith('/icons/');

  if (isBrandIcon) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (['script', 'style', 'worker'].includes(dest) || url.pathname.startsWith('/src/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (['font', 'image'].includes(dest)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
