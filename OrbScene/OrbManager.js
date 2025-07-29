// OrbScene/OrbManager.js
import { TimerBar } from '../CanvasUI/TimerBar.js';
import { ClickCircle } from '../CanvasComponents/ClickCircle.js';
import { Orb } from './Orb.js';

export class OrbManager {
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
        spawnInterval: 2.5,
        spawnChancePerSecond: null,
        drawPriority: 1,
        maxAmount: null,
        spawnedCount: 0,
        onCatch: (manager) => {}
      },
      largeMedium: {
        radius: 30,
        speed: 40,
        color: '0,0,255',
        spawnInterval: 6,
        spawnChancePerSecond: 0.1,
        drawPriority: 2,
        maxAmount: 2,
        spawnedCount: 0,
        onCatch: (manager) => {
          manager.timerBar.addTime(10);
        }
      },
      boosterOrb: {
        radius: 15,
        speed: 50,
        color: '0,255,0',
        spawnInterval: null,
        spawnChancePerSecond: 0.025,
        drawPriority: 3,
        maxAmount: 1,
        spawnedCount: 0,
        onCatch: (manager) => {
          manager.clickCircles.maxClickCircles = Math.min(manager.clickCircles.maxClickCircles + 1, 5);
        }
      },
    };

    this.orbs = [];
    this.spawnTimers = {};
    Object.keys(this.orbTypes).forEach(type => (this.spawnTimers[type] = 0));

    this.clickCircles = new ClickCircle(3, {
      lineWidth: 3,
      duration: 2,
      startRadius: 5,
      maxRadius: 36,
      dynamicLineWidth: false,
    });

    this.isPointerDown = false;

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
    Object.values(this.orbTypes).forEach(t => (t.spawnedCount = 0));
  }

  spawnOrb(type) {
    const t = this.orbTypes[type];

    // Prevent spawning if maxAmount is set and reached
    if (t.maxAmount != null && t.spawnedCount >= t.maxAmount) return;

    const radius = t.radius;
    const x = Math.random() * (this.width - 2 * radius) + radius;
    const y = -radius;

    this.orbs.push(new Orb(x, y, type, radius, t.speed, t.color, t.drawPriority));
    t.spawnedCount++;
  }

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
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
      };
    }
  }

  handlePointerDown(evt) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;
    this.isPointerDown = true;
  }

  handlePointerUp(evt) {
    if (evt.pointerType === 'mouse' && evt.button !== 0) return;
    this.isPointerDown = false;

    // Directly add new circle without checks
    const { x, y } = this.getInputPosition(evt);
    this.clickCircles.add(x, y);
  }

  update(dt) {
    this.clickCircles.update(dt, this.isPointerDown);
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
        if (radius < orb.radius) continue;
        if (distSq <= (radius - orb.radius) ** 2) {
          orbCaught = true;
          this.orbs.splice(j, 1);

          const typeData = this.orbTypes[orb.type];
          if (typeData && typeof typeData.onCatch === 'function') {
            typeData.onCatch(this);
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
      const orbType = this.orbTypes[type];

      // --- INTERVAL-BASED SPAWNING ---
      if (orbType.spawnInterval != null) {
        this.spawnTimers[type] += dt;
        if (this.spawnTimers[type] >= orbType.spawnInterval) {
          this.spawnOrb(type);
          this.spawnTimers[type] -= orbType.spawnInterval;
        }
      }

      // --- CHANCE-BASED SPAWNING ---
      if (orbType.spawnChancePerSecond != null) {
        const chance = orbType.spawnChancePerSecond;
        const spawnProbability = 1 - Math.pow(1 - chance, dt);
        if (Math.random() < spawnProbability) {
          this.spawnOrb(type);
        }
      }
    }
  }

  updateOrbs(dt) {
    this.orbs.forEach(orb => orb.update(dt));
    this.orbs = this.orbs.filter(orb => {
      if (orb.y - orb.radius > this.height) {
        if (orb.type === 'smallFast') {
          this.timerBar.subtractTime(5);
        }
        return false; // remove this orb
      }
      return true; // keep this orb
    });
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
    this.clickCircles.destroy();
  }
}
