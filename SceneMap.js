// SceneMap.js
import { OrbScene } from './OrbScene/OrbScene.js';
import { RoomManager } from './Rooms/RoomManager.js';
import { FishingManager } from './Fishing/FishingManager.js';

export const SceneMap = {
  orbClicker: (context) =>
    new OrbScene(context),

  rooms: (context) =>
    new RoomManager(context),

  fishing: (context) =>
    new FishingManager(context),
};