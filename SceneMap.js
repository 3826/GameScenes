// SceneMap.js
import { OrbScene } from './OrbScene/OrbScene.js';
import { Mode2Scene } from './Mode2Scene.js'; // Assuming you have this from previous step
import { Mode3Scene } from './Mode3Scene.js'; // Placeholder for mode 3 scene

export const SceneMap = {
  orbClicker: (context) =>
    new OrbScene(context),

  mode2: (context) =>
    new Mode2Scene(context),

  mode3: (context) =>
    new Mode3Scene(context),
};