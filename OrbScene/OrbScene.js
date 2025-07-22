// OrbScene/OrbScene.js
import { TimerBar } from '../CanvasUI/TimerBar.js';
import { ClickCircle } from './ClickCircle.js';
import { Orb } from './Orb.js';

export class OrbScene {
  constructor({ canvas, ctx, width, height, scale, sceneManager }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.sceneManager = sceneManager;

    this.timerBar = new TimerBar(ctx, 10, 10, 200, 20, 60);

    this.orbTypes = {
      smallFast: {
        radius: 10,
        speed: 60,
        color: '255,0,0',
        spawnInterval: 2,
        drawPriority: 1 // lower = behind
      },
      largeMedium: {
        radius: 32,
        speed: 40,
        color: '0,0,255',
        spawnInterval: 5,
        drawPriority: 2
      }
    };

    this.orbs = [];
    this.spawnTimers = {};
    Object.keys(this.orbTypes).forEach(type => (this.spawnTimers[type] = 0));

    this.clickCircles = new ClickCircle(3);

    this.isMouseDown = false;
    this.didPauseOnMouseDown = false;

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

  init() {
    Object.keys(this.spawnTimers).forEach(type => (this.spawnTimers[type] = 0));
  }

  spawnOrb(type) {
    const t = this.orbTypes[type];
    const radius = t.radius;
    const x = Math.random() * (this.width - 2 * radius) + radius;
    const y = -radius;
    this.orbs.push(new Orb(x, y, type, radius, t.speed, t.color, t.drawPriority));
  }

  getInputPosition(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) / this.scale,
      y: (evt.clientY - rect.top) / this.scale
    };
  }

  handlePointerDown(evt) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;

    this.isMouseDown = true;
    this.didPauseOnMouseDown = this.clickCircles.tryPauseLastIfFull();
  }

  handlePointerUp(evt) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;

    this.isMouseDown = false;

    if (!this.didPauseOnMouseDown && this.clickCircles.shouldAddNewCircle()) {
      const { x, y } = this.getInputPosition(evt);
      this.clickCircles.add(x, y);
    }

    this.didPauseOnMouseDown = false;
}

  update(dt) {
    this.clickCircles.update(dt, this.isMouseDown);
    this.processCircleOrbInteractions();
    this.spawnOrbs(dt);
    this.updateOrbs(dt);
    this.timerBar.update(dt);
    this.draw();
  }

  processCircleOrbInteractions() {
    const circles = this.clickCircles.getCircles();

    for (let i = circles.length - 1; i >= 0; i--) {
      const circle = circles[i];
      const radius = circle.getRadius();
      let orbCaught = false;

      for (let j = this.orbs.length - 1; j >= 0; j--) {
        const orb = this.orbs[j];
        const dx = orb.x - circle.x;
        const dy = orb.y - circle.y;
        const distSq = dx*dx + dy*dy;

        if (distSq <= (radius - orb.radius) ** 2) {
          orbCaught = true;
          this.orbs.splice(j, 1);

          if (orb.type === 'smallFast') {
            this.timerBar.addTime(5);
          } else if (orb.type === 'largeMedium') {
            this.timerBar.subtractTime(5);
          }
        }
      }

      if (orbCaught) {
        this.clickCircles.removeAt(i);
      }
    }
  }

  spawnOrbs(dt) {
    for (const type in this.orbTypes) {
      this.spawnTimers[type] += dt;
      if (this.spawnTimers[type] >= this.orbTypes[type].spawnInterval) {
        this.spawnOrb(type);
        this.spawnTimers[type] -= this.orbTypes[type].spawnInterval;
      }
    }
  }

  updateOrbs(dt) {
    this.orbs.forEach(orb => orb.update(dt));
    this.orbs = this.orbs.filter(orb => orb.y - orb.radius <= this.height);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.clickCircles.draw(this.ctx);

    this.orbs
      .slice() // non-mutating copy
      .sort((a, b) => a.drawPriority - b.drawPriority)
      .forEach(orb => orb.draw(this.ctx));

    this.timerBar.draw();
  }

  destroy() {
    this.removeAllListeners();
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.orbs = null;
    if (this.timerBar) this.timerBar.elapsed = 0;

    this.canvas = null;
    this.ctx = null;
    this.sceneManager = null;
    this.timerBar = null;
    this.orbTypes = null;
    this.spawnTimers = null;
    this.clickCircles = null;
  }
}
