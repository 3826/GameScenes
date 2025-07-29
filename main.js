// main.js
import { CANVAS_WIDTH, CANVAS_HEIGHT, DPR } from './constants.js';
import { SceneManager } from './SceneManager.js';
import { SceneMap } from './SceneMap.js';
import { UIManager } from './UIManager.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  
  // Set canvas internal resolution for sharpness on high-DPI screens
  canvas.width = CANVAS_WIDTH * DPR;
  canvas.height = CANVAS_HEIGHT * DPR;

  // Set canvas CSS size to logical size
  canvas.style.width = CANVAS_WIDTH + 'px';
  canvas.style.height = CANVAS_HEIGHT + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);

  // Calculate initial scale to fit viewport once
  const scale = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);

  const sceneManager = new SceneManager();
  const uiManager = new UIManager();

  const context = { canvas, ctx, width: CANVAS_WIDTH, height: CANVAS_HEIGHT, scale, sceneManager };
  
  let gamePaused = false;
  
  if ('serviceWorker' in navigator) {
    console.log('ServiceWorker:');
    
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('- Registered with scope:', registration.scope);

        // Listen for updates to the service worker
        registration.addEventListener('updatefound', () => {
          console.log('- Update found.');
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('- Update installed. Reloading...');
              window.location.reload();
            }
          });
        });
      })
      .catch(err => {
        console.error('- Registration failed:', err);
      });

    // Reload page when service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('Running as PWA (standalone mode)');
  } else {
    console.log('Running in browser tab');
  }

  function onModeSelected(mode) {
    uiManager.hide('title'); // Hide the DOM title screen
    document.getElementById('back-btn').style.display = 'block';
    canvas.style.display = 'block'; // Show canvas
    canvas.focus();
    switch (mode) {
      case 'Orbs':
        sceneManager.switchScene(SceneMap.orbClicker(context));
        break;
      case 'rooms':
        sceneManager.switchScene(SceneMap.rooms(context));
        break;
      case 'fishing':
        sceneManager.switchScene(SceneMap.fishing(context));
        break;
      default:
        alert(`${mode} not implemented yet.`);
        uiManager.show('title'); // Show title screen if no valid mode
        break;
    }
  }

  function backToTitle() {
    uiManager.show('title');
    canvas.style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    sceneManager.switchScene(null);
  }

  function togglePause(forcePause = null) {
    if (forcePause === null) {
      gamePaused = !gamePaused;
    } else {
      gamePaused = forcePause;
    }
    document.getElementById('pause-screen').style.display = gamePaused ? 'flex' : 'none';

    if (sceneManager.currentScene) {
      if (gamePaused && typeof sceneManager.currentScene.pause === 'function') {
        sceneManager.currentScene.pause();
      } else if (!gamePaused && typeof sceneManager.currentScene.resume === 'function') {
        sceneManager.currentScene.resume();
      }
    }
  }

  uiManager.init(onModeSelected, backToTitle, () => {
    togglePause(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && sceneManager.currentScene) {
      togglePause();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      togglePause(true);
    } 
    // else {
    //   togglePause(false);
    // }
  });

  window.addEventListener('blur', () => {
    togglePause(true);
  });

  uiManager.show('title'); // Show DOM title screen initially

  sceneManager.currentScene = null;

  let lastTime = 0;
    function gameLoop(time = 0) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    if (!gamePaused && sceneManager.currentScene) {
      sceneManager.update(dt);
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
});
