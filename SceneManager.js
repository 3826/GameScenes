//SceneManager.js
export class SceneManager {
  constructor() {
    this.currentScene = null;
  }

  switchScene(newScene) {
    
    if (this.currentScene && this.currentScene.destroy) {
      console.log('Calling destroy() of previous scene');
      this.currentScene.destroy();
    }

    this.currentScene = newScene;
    
    if (this.currentScene && this.currentScene.init) {
      console.log('Calling init() of new scene');
      this.currentScene.init();
    }
  }

  update(dt) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(dt);
    }
  }
}
