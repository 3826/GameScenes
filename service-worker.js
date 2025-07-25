const CACHE_NAME = 'orb-clicker-cache-v0.1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        './',
        './CanvasComponents/ClickCircle.js',
        './CanvasComponents/ClickCircleInstance.js',
        './CanvasUI/TimerBar.js',
        './Fishing/FishingManager.js',
        './OrbScene/Orb.js',
        './OrbScene/OrbScene.js',
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
      ])
    )
  );
});

self.addEventListener('activate', (event) => {
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
