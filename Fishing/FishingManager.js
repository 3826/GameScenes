// Fishing/FishingManager.js
import { ClickCircle } from '../CanvasComponents/ClickCircle.js';
import { Messager } from '../CanvasUI/Messager.js';

export class FishingManager {
  constructor({ canvas, ctx, width, height, scale, sceneManager }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.sceneManager = sceneManager;

    this.clickCircles = new ClickCircle(1, {
      lineWidth: 2,
      duration: 1.5,
      startRadius: 1,
      maxRadius: 10,
      dynamicLineWidth: true,
    });

    // Initialize Messager with canvas context
    this.messager = new Messager(this.ctx, {
      duration: 1.5,
      font: '24px Arial',
      color: 'white',
    });

    this.currentClickPos = null;
    this.clickTimer = 0;

    const pondWidth = width * 0.6;
    const pondHeight = height * 0.4;
    this.PondBoundary = {
      x: (width - pondWidth) / 2,
      y: (height - pondHeight) / 2,
      width: pondWidth,
      height: pondHeight,
    };

    this.fishTable = [
      { name: 'Common Fish', baseWeight: 30 },
      { name: 'Uncommon Fish', baseWeight: 10 },
      { name: 'Rare Fish', baseWeight: 0.01 },
      { name: 'Legendary Fish', baseWeight: 0.1 },
    ];

    this.isPointerDown = false;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.preventContextMenu = e => e.preventDefault();

    this.addListener(this.canvas, 'contextmenu', this.preventContextMenu, { passive: false });
    this.addListener(this.canvas, 'pointerdown', this.handlePointerDown, { passive: true });
    this.addListener(this.canvas, 'pointerup', this.handlePointerUp, { passive: true });
  }

  addListener(target, event, handler, options = {}) {
    if (!this._listeners) this._listeners = [];
    target.addEventListener(event, handler, options);
    this._listeners.push({ target, event, handler, options });
  }

  removeAllListeners() {
    if (!this._listeners) return;
    this._listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this._listeners = [];
  }

  init() {
    this.clickTimer = 1;
    this.fishList = [];
    console.log("Fishing scene initialized");
  }

  getInputPosition(evt) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  }

  pointerInPond(x, y) {
    const p = this.PondBoundary;
    return x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height;
  }

  handlePointerDown(evt) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;
    this.isPointerDown = true;
  }

  handlePointerUp(evt) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;
    this.isPointerDown = false;

    const { x, y } = this.getInputPosition(evt);
    if (this.pointerInPond(x, y)) {
      this.currentClickPos = { x, y };
      this.clickCircles.clickCircles = [];
      this.clickCircles.add(x, y);
      this.clickTimer = 1;
    }
  }

  pickFish() {
    const caughtFish = this.fishTable.filter(fish => {
      return Math.random() < fish.baseWeight / 100;
    });

    if (caughtFish.length === 0) return null;

    caughtFish.sort((a, b) => b.baseWeight - a.baseWeight);
    return caughtFish[0];
  }

  update(dt) {
    this.clickCircles.update(dt, this.isPointerDown);
    this.messager.update(dt);

    if (!this.currentClickPos) {
      this.clickTimer = 1;
      return this.draw();
    }

    this.clickCircles.add(this.currentClickPos.x, this.currentClickPos.y);

    this.clickTimer -= dt;
    if (this.clickTimer <= 0) {
      const caughtFish = this.pickFish();
      if (caughtFish) {
        console.log('Caught:', caughtFish.name);
        this.clickCircles.destroy();
        this.currentClickPos = null;
        this.clickTimer = 1;
        // Show fish caught message
        this.messager.addMessage(`Caught: ${caughtFish.name}`, { duration: 2 });
      } else {
        console.log('No fish caught this second.');
        this.clickTimer = 1;
      }
    }

    this.draw();
  }

  drawPond() {
    const p = this.PondBoundary;
    this.ctx.fillStyle = "rgb(16, 65, 110)";
    this.ctx.fillRect(p.x - 20, p.y - 20, p.width + 40, p.height + 40);
    this.ctx.fillStyle = "rgb(19, 86, 148)";
    this.ctx.fillRect(p.x, p.y, p.width, p.height);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawPond();
    this.clickCircles.draw(this.ctx);
    this.messager.draw();
  }

  destroy() {
    this.removeAllListeners();
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.clickCircles) {
      this.clickCircles.destroy();
      this.clickCircles = null;
    }
    this.fishList = [];
    console.log("Fishing scene destroyed");
  }
}
