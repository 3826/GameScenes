//CanvasComponents/ClickCircleInstance.js
export class ClickCircleInstance {
  constructor(x, y, { lineWidth = 3, duration = 2, startRadius = 5, maxRadius = 35 } = {}) {
    this.x = x;
    this.y = y;
    this.elapsed = 0;

    this.lineWidth = lineWidth;
    this.duration = duration;
    this.startRadius = startRadius;
    this.maxRadius = maxRadius;

    this.isPaused = false;
  }

    update(dt, isMouseDown) {
        if (!this.isPaused) this.elapsed += dt;
        if (!isMouseDown) this.isPaused = false;
    }

    isExpired() {
        return this.elapsed >= this.duration;
    }

    getRadius() {
        const t = this.elapsed / this.duration;
        return t * this.maxRadius + this.startRadius;
    }

    draw(ctx) {
        const radius = this.getRadius();
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.stroke();
    }
}
