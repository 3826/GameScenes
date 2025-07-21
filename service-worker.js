self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('orb-clicker-cache-v1').then((cache) =>
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
        './icons/icon-512.png'
      ])
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
