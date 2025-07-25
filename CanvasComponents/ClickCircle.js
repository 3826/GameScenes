//OrbScene/ClickCircle.js
import { ClickCircleInstance } from './ClickCircleInstance.js';

export class ClickCircle {
  constructor(maxCircles, optionalArgs = {}) {
    this.clickCircles = [];
    this.maxClickCircles = maxCircles;

    // Store optional defaults for ClickCircleInstance
    this.optionalArgs = optionalArgs;
  }

  canAdd() {
    return this.clickCircles.length < this.maxClickCircles;
  }

  tryPauseLastIfFull() {
    if (!this.canAdd() && this.clickCircles.length) {
      this.clickCircles[this.clickCircles.length - 1].isPaused = true;
      return true;
    }
    return false;
  }

  shouldAddNewCircle() {
    const len = this.clickCircles.length;
    if (len === 0) return true;
    const last = this.clickCircles[len - 1];
    return !last.isPaused;
  }

  add(x, y) {
    if (!this.canAdd()) return;
    this.clickCircles.push(new ClickCircleInstance(x, y, this.optionalArgs));
  }

  removeAt(index) {
    console.log('removeAt');
    if (index >= 0 && index < this.clickCircles.length) {
      this.clickCircles.splice(index, 1);
    }
  }

  update(dt, isMouseDown) {
    for (let i = this.clickCircles.length - 1; i >= 0; i--) {
      const circle = this.clickCircles[i];
      circle.update(dt, isMouseDown);
      if (circle.isExpired()) {
        this.clickCircles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.clickCircles.forEach((circle) => {
      circle.draw(ctx);
    });
  }

  getCircles() {
    return this.clickCircles;
  }
}
