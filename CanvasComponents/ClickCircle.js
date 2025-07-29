//CanvasComponents/ClickCircle.js
import { ClickCircleInstance } from './ClickCircleInstance.js';

export class ClickCircle {
  constructor(maxCircles, optionalArgs = {}) {
    this.clickCircles = [];
    this.maxClickCircles = maxCircles;
    this.optionalArgs = optionalArgs;
  }

  canAdd() {
    return this.clickCircles.length < this.maxClickCircles;
  }

  add(x, y) {
    if (!this.canAdd()) return;
    this.clickCircles.push(new ClickCircleInstance(x, y, this.optionalArgs));
  }

  removeAt(index) {
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

  destroy() {
    this.clickCircles = [];
  }
}
