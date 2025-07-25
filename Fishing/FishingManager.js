// Fishing/FishingManager.js
import { ClickCircle } from '../CanvasComponents/ClickCircle.js';

export class FishingManager {
  constructor({ canvas, ctx, width, height, scale, sceneManager }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.sceneManager = sceneManager;

    const maxClickCircles = 1;
    this.clickCircles = new ClickCircle(maxClickCircles, {
      lineWidth: 1,
      duration: 1.5,
      startRadius: 1.5,
      maxRadius: 10
    });

    this.PondBoundary = {
      x: this.width * 0.2,
      y: this.height * 0.2,
      width: this.width * 0.6,
      height: this.height * 0.6,
    }

    this.isPointerDown = false;
    this.didPauseOnPointerDown = false;

    this.emptyClickHandler = () => {};
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    
    this.preventContextMenu = e => e.preventDefault();
    this.addListener(this.canvas, 'contextmenu', this.preventContextMenu, { passive: false });

    this.addListener(this.canvas, 'click', this.emptyClickHandler);
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

  init() {}

  getInputPosition(evt) {
    const rect = this.canvas.getBoundingClientRect();
    if (evt.pointerType === 'touch') {
      console.log('touch');
      return {
        x: (evt.clientX - rect.left) / this.scale,
        y: (evt.clientY - rect.top) / this.scale
      };
    } 
    else if (evt.pointerType === 'mouse') {
      console.log('mouse');
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
      };
    }
  }

  pointerInPond(x, y) {
    return (
      x >= this.PondBoundary.x &&
      x <= this.PondBoundary.x + this.PondBoundary.width &&
      y >= this.PondBoundary.y &&
      y <= this.PondBoundary.y + this.PondBoundary.height
    );
  }

  handlePointerDown(evt) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;

    this.isPointerDown = true;
    this.didPauseOnPointerDown = this.clickCircles.tryPauseLastIfFull();
  }

  handlePointerUp(evt) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;
    this.isPointerDown = false;

    const { x, y } = this.getInputPosition(evt);

    if (this.pointerInPond(x,y) && this.clickCircles.shouldAddNewCircle()) {
      this.clickCircles.add(x, y);
    }

    this.didPauseOnPointerDown = false;
  }

  update(dt) {
    this.clickCircles.update(dt, this.isPointerDown);
    this.draw();
  }

  drawPond() {
    this.ctx.fillStyle = "rgb(16, 65, 110)";
    this.ctx.fillRect(this.PondBoundary.x - 20, this.PondBoundary.y -20, this.PondBoundary.width + 40, this.PondBoundary.height + 40);
    this.ctx.fillStyle = "rgb(19, 86, 148)";
    this.ctx.fillRect(this.PondBoundary.x, this.PondBoundary.y, this.PondBoundary.width, this.PondBoundary.height);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawPond();
    this.clickCircles.draw(this.ctx);
  }

  destroy() {
    this.removeAllListeners();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.clickCircles = null;
  }
}

