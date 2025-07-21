import { Orb } from './Orb.js';
import { TimerBar } from '../CanvasUI/TimerBar.js';

export class OrbScene {
  constructor({ canvas, ctx, width, height, sceneManager }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.sceneManager = sceneManager;

    this.timerTime = 10;
    this.timerBar = new TimerBar(ctx, 10, 10, this.width / 4, this.height / 40, this.timerTime);

    this.orbTypes = {
      smallFast: { radius: 10, speed: 50, color: 'blue', spawnInterval: 3 },
      largeMedium: { radius: 30, speed: 30, color: 'red', spawnInterval: 3 },
    };

    this.orbs = [];
    this.spawnTimers = {};
    Object.keys(this.orbTypes).forEach(type => this.spawnTimers[type] = 0);

    this.clickCircles = [];
    this.allowMultipleCircles = true;
    this.maxClickCircles = 3;

    this.isMouseDown = false;
    this.didPauseOnMouseDown = false;

    // Bind handlers once for proper add/remove
    this.emptyClickHandler = () => {};
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.preventContextMenu = e => e.preventDefault();

    // Use helper to add event listeners
    this.addListener(this.canvas, 'click', this.emptyClickHandler);
    this.addListener(this.canvas, 'mousedown', this.handleMouseDown);
    this.addListener(this.canvas, 'mouseup', this.handleMouseUp);
    this.addListener(this.canvas, 'contextmenu', this.preventContextMenu);
  }

  addListener(target, event, handler) {
    if (!this._listeners) this._listeners = [];
    target.addEventListener(event, handler);
    this._listeners.push({ target, event, handler });
  }

  removeAllListeners() {
    if (!this._listeners) return;
    this._listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this._listeners = [];
  }

  init() {
    Object.keys(this.spawnTimers).forEach(type => this.spawnTimers[type] = 0);
  }

  spawnOrb(type) {
    const t = this.orbTypes[type];
    const x = Math.random() * (this.width - 2 * t.radius) + t.radius;
    const y = -t.radius;
    this.orbs.push(new Orb(x, y, type, t.radius, t.speed, t.color));
  }

  handleClick(evt) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = evt.clientX - rect.left;
    const mouseY = evt.clientY - rect.top;

    if (!this.allowMultipleCircles || this.clickCircles.length < this.maxClickCircles) {
      this.clickCircles.push({
        x: mouseX,
        y: mouseY,
        elapsed: 0,
        duration: 2,
        startRadius: 5,
        maxRadius: 33,
        isPaused: false,
      });
    }
  }

  handleMouseDown(evt) {
    if (evt.button === 0) {
      this.isMouseDown = true;
      this.didPauseOnMouseDown = false;

      if (!this.allowMultipleCircles && this.clickCircles.length === 1) {
        this.clickCircles[0].isPaused = true;
        this.didPauseOnMouseDown = true;
      }
    }
  }

  handleMouseUp(evt) {
    this.isMouseDown = false;

    if (evt.button === 2) {
      if (this.clickCircles.length > 0) {
        this.clickCircles.pop();
      }
      return;
    }

    if (evt.button !== 0) return;

    const noCircles = this.clickCircles.length === 0;
    const lastPaused = this.clickCircles.length > 0 && this.clickCircles[this.clickCircles.length - 1].isPaused;

    const canSpawn = !this.didPauseOnMouseDown && (this.allowMultipleCircles || noCircles || !lastPaused);

    if (canSpawn) {
      this.handleClick(evt);
    }

    this.didPauseOnMouseDown = false;
  }

  update(dt) {
    this.clickCircles.forEach((c) => {
      if (!c.isPaused) {
        c.elapsed += dt;
      }
      if (!this.isMouseDown) {
        c.isPaused = false;
      }
    });

    this.clickCircles = this.clickCircles.filter(c => {
      const t = c.elapsed / c.duration;
      const radius = t * c.maxRadius + c.startRadius;

      let orbRemoved = false;

      this.orbs = this.orbs.filter(orb => {
        const dx = orb.x - c.x;
        const dy = orb.y - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist + orb.radius <= radius) {
          orbRemoved = true;
          if (orb.type === 'smallFast') {
            this.timerBar.elapsed = Math.min(this.timerTime, this.timerBar.elapsed + 5);
          }
          else if (orb.type === 'largeMedium') {
            this.timerBar.elapsed = Math.max(0, this.timerBar.elapsed - 5);
          }
          return false;
        }
        return true;
      });

      return !orbRemoved && c.elapsed < c.duration;
    });

    for (const type in this.orbTypes) {
      this.spawnTimers[type] += dt;
      if (this.spawnTimers[type] >= this.orbTypes[type].spawnInterval) {
        this.spawnOrb(type);
        this.spawnTimers[type] = 0;
      }
    }

    this.orbs.forEach(orb => orb.update(dt));
    this.orbs = this.orbs.filter(orb => orb.y - orb.radius <= this.height);

    this.timerBar.update(dt);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.orbs.forEach(orb => orb.draw(this.ctx));
    this.timerBar.draw();

    this.clickCircles.forEach(c => {
      const t = c.elapsed / c.duration;
      const radius = t * c.maxRadius + c.startRadius;
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
  }

  destroy() {
    console.log('destroy');
    this.removeAllListeners();
  }
}
