const cacheName = 'news-v1';
const staticAssets = [
  './',
  './index.html',
  './styles.css',
  './scripts.js',
  './newsApi.js',
  './manifest.webmanifest',
  './news-article.js',
  './images/icon-192x192.png',
  './images/icon-512x512.png'
];

self.addEventListener('install', async evt => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', evt => {
  self.clients.claim();
});

self.addEventListener('fetch', async evt => {
  const req = evt.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    evt.respondWith(cacheFirst(req));
  }
  else {
    evt.respondWith(networkAndCache(req));
  }
})

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  }
  catch (err) {
    const cached = await cache.match(req);
    return cached;
  }
}
