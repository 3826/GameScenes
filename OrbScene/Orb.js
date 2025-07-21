// OrbScene/Orb.js
export class Orb {
  constructor(x, y, type, radius, speed, color) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = radius;
    this.speed = speed; // vertical speed (pixels per second)
    this.color = color;
  }

  update(dt) {
    this.y += this.speed * dt;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}