// CanvasUI/TimerBar.js
export class TimerBar {
  constructor(ctx, x, y, width, height, duration) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.duration = duration;
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
    const stepDuration = 3; // seconds per chunk (adjust as needed)
    // Snap elapsed to nearest step for discrete visual update
    const steppedElapsed = Math.floor(this.elapsed / stepDuration) * stepDuration;
    const percent = 1 - steppedElapsed / this.duration;

    // Background bar (no offset for fill)
    ctx.fillStyle = '#444';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Fill bar
    ctx.fillStyle = '#0f0';
    ctx.fillRect(this.x, this.y, this.width * percent, this.height);
  }

  isExpired() {
    return !this.active;
  }
}
