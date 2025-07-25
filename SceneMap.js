// SceneMap.js
import { OrbManager } from './OrbScene/OrbManager.js';
import { RoomManager } from './Rooms/RoomManager.js';
import { FishingManager } from './Fishing/FishingManager.js';

export const SceneMap = {
  orbClicker: (context) =>
    new OrbManager(context),

  rooms: (context) =>
    new RoomManager(context),

  fishing: (context) =>
    new FishingManager(context),
};