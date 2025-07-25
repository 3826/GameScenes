// RoomScene/RoomScene.js
import { Room } from './Room.js';

export class RoomManager {
  constructor({ canvas, ctx, width, height, scale, sceneManager }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.sceneManager = sceneManager;
  }

  draw() {
    // Draw background
    this.drawBaseRect();

    // Draw two sets: original and shifted by 150 in X
    this.drawBlock(0, false);
    this.drawBlock(150, true);
  }

  drawBaseRect() {
    this.ctx.fillStyle = "rgb(53, 41, 27)";
    this.ctx.fillRect(this.width * 0.1, this.height * 0.1, this.width * 0.8, this.height * 0.8);
  }

  drawBlock(xOffset, a) {
    const baseX = this.width * 0.2 + xOffset;
    const baseY = this.height * 0.12;

    // Black base square
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.fillRect(baseX + 5, baseY + 5.5, 60, 60);

    // Draw layered horizontal lines
    this.drawHorizontalLines(baseX, baseY);

    if (a) {
      // Translucent yellow overlay
      this.ctx.fillStyle = "rgba(255, 240, 37, 0.16)";
      this.ctx.fillRect(baseX + 10, baseY + 10.5, 50, 60);
    }
  }

  drawHorizontalLines(baseX, baseY) {
    const lines = [
      { y: 15.5, color: "rgb(44, 26, 5)" },
      { y: 25.5, color: "rgb(80, 46, 8)" },
      { y: 35.5, color: "rgb(102, 59, 10)" },
      { y: 45.5, color: "rgb(129, 75, 12)" },
      { y: 55.5, color: "rgb(167, 96, 15)" }
    ];

    this.ctx.lineWidth = 10.5;
    for (const line of lines) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = line.color;
      this.ctx.moveTo(baseX + 9.5, baseY + line.y);
      this.ctx.lineTo(baseX + 60, baseY + line.y);
      this.ctx.stroke();
    }
  }

  update() {
    
    this.draw();
  }
}
