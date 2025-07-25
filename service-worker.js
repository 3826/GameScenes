const CACHE_NAME = 'orb-clicker-cache-v0.1.1'
const FILES_TO_CACHE = [
  './',
  './CanvasComponents/ClickCircle.js',
  './CanvasComponents/ClickCircleInstance.js',
  './CanvasUI/TimerBar.js',
  './Fishing/FishingManager.js',
  './OrbScene/Orb.js',
  './OrbScene/OrbManager.js',
  './Rooms/Rooms.js',
  './Rooms/RoomManager.js',
  './constants.js',
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
  self.skipWaiting(); // Force install to complete immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  self.clients.claim(); // Take control immediately
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', event => {
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
