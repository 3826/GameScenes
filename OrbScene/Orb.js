// OrbScene/Orb.js
export class Orb {
  constructor(x, y, type, radius, speed, rgbColor, drawPriority) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = radius;
    this.speed = speed;
    this.rgbColor = rgbColor;
    this.drawPriority = drawPriority ?? 0;
  }

  update(dt) {
    this.y += this.speed * dt;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.rgbColor}, 1)`;
    ctx.fill();
  }
}
