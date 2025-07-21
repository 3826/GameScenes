//main.js
import { CANVAS_WIDTH, CANVAS_HEIGHT, DPR } from './constants.js';
import { SceneManager } from './SceneManager.js';
import { SceneMap } from './SceneMap.js';
import { UIManager } from './UIManager.js';

const canvas = document.getElementById('canvas');

canvas.width = CANVAS_WIDTH * DPR;
canvas.height = CANVAS_HEIGHT * DPR;
canvas.style.width = CANVAS_WIDTH + 'px';
canvas.style.height = CANVAS_HEIGHT + 'px';
const ctx = canvas.getContext('2d');
ctx.scale(DPR, DPR);

const sceneManager = new SceneManager();
const uiManager = new UIManager();

const context = { canvas, ctx, width: CANVAS_WIDTH, height: CANVAS_HEIGHT, sceneManager };

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
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
  switch (mode) {
    case 'Orb Clicker':
      sceneManager.switchScene(SceneMap.orbClicker(context));
      break;
    case 'Mode 2':
      sceneManager.switchScene(SceneMap.mode2(context));
      break;
    case 'Mode 3':
      sceneManager.switchScene(SceneMap.mode3(context));
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
  sceneManager.switchScene(null);  // or a dedicated 'title' scene if you want
}

uiManager.init(onModeSelected, backToTitle);
uiManager.show('title'); // Show DOM title screen initially

sceneManager.currentScene = null;

let lastTime = 0;
function gameLoop(time = 0) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  if (sceneManager.currentScene) {
    sceneManager.update(dt);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);