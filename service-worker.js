const CACHE_NAME = 'orb-clicker-cache-v0.02';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        './',
        './index.html',
        './style.css',
        './main.js',
        './UIManager.js',
        './SceneMap.js',
        './SceneManager.js',
        './Mode3Scene.js',
        './Mode2Scene.js',
        './manifest.json',
        './constants.js',
        './OrbScene/Orb.js',
        './OrbScene/OrbScene.js',
        './CanvasUI/TimerBar.js',
        './favicon.ico'
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
