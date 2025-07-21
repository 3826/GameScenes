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

function onModeSelected(mode) {
  uiManager.hide('title'); // Hide the DOM title screen
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

uiManager.init(onModeSelected);
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
