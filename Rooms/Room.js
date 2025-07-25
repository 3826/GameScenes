// Rooms/Room.js
export class Room {
  constructor(x, y, type, size) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
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
