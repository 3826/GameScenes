const CACHE_NAME_BASE = 'GameProto';
const CACHE_VERSION = 'v0.1.2.2';
const CACHE_NAME = `${CACHE_NAME_BASE}-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
  './',
  './CanvasComponents/ClickCircle.js',
  './CanvasComponents/ClickCircleInstance.js',
  './CanvasUI/Messager.js',
  './CanvasUI/TimerBar.js',
  './Fishing/FishingManager.js',
  './OrbScene/Orb.js',
  './OrbScene/OrbManager.js',
  './Rooms/Room.js',
  './Rooms/RoomManager.js',
  './globals.js',
  './favicon.ico',
  './index.html',
  './main.js',
  './manifest.json',
  './SceneManager.js',
  './SceneMap.js',
  './style.css',
  './UIManager.js',
];

// These files should always attempt to update from the network first
const ALWAYS_UPDATE = ['./main.js'];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing - version:', CACHE_NAME);
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(file);
          console.log('[ServiceWorker] Cached:', file);
        } catch (err) {
          console.error('[ServiceWorker] Failed to cache:', file, err);
        }
      }
      console.log('[ServiceWorker] All files processed');
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating - version:', CACHE_NAME);
  self.clients.claim(); // Take control immediately

  // Send version to all clients
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    ).then(() =>
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'version', version: CACHE_NAME });
        });
      })
    )
  );
});

self.addEventListener('fetch', event => {
  console.log('[ServiceWorker] Fetching:', event.request.url);
  const url = new URL(event.request.url);
  const shouldAlwaysUpdate = ALWAYS_UPDATE.some(path => url.pathname.endsWith(path));

  if (shouldAlwaysUpdate) {
    // Network-first strategy
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match(event.request)) // fallback if offline
    );
  } else {
    // Cache-first strategy
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
