//CanvasUI/TimerBar.js
export class TimerBar {
  constructor(ctx, x, y, width, height, duration) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.duration = duration; // total time in seconds
    this.elapsed = 0;
    this.active = true;
  }

  reset() {
    this.elapsed = 0;
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;

    this.elapsed += dt;
    if (this.elapsed >= this.duration) {
      this.elapsed = this.duration;
      this.active = false;
    }
  }

  draw() {
    const ctx = this.ctx;
    const percent = 1 - this.elapsed / this.duration;

    // Background bar
    ctx.fillStyle = '#444';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Fill bar
    ctx.fillStyle = '#0f0';
    ctx.fillRect(this.x, this.y, this.width * percent, this.height);

    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  isExpired() {
    return !this.active;
  }
}
