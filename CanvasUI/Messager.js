// CanvasUI/Messager.js
export class Messager {
  constructor(ctx, options = {}) {
    this.ctx = ctx;
    this.messages = [];
    this.defaultDuration = options.duration || 1.5;
    this.defaultFont = options.font || '24px Arial';
    this.defaultColor = options.color || 'white';
  }

  /**
   * Add a message to display.
   * @param {string} text - The message text
   * @param {object} opts - Optional settings:
   *   - duration: seconds before fading
   *   - font: CSS font string
   *   - color: fillStyle color string
   *   - position: {x, y} coordinates (defaults to center top)
   */
  addMessage(text, opts = {}) {
    const message = {
      text,
      duration: opts.duration ?? this.defaultDuration,
      font: opts.font ?? this.defaultFont,
      color: opts.color ?? this.defaultColor,
      elapsed: 0,
      alpha: 1,
      position: opts.position || null, // if null, will center horizontally near top
      fading: false,
    };
    this.messages.push(message);
  }

  update(dt) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const msg = this.messages[i];
      msg.elapsed += dt;
      if (!msg.fading && msg.elapsed > msg.duration) {
        msg.fading = true;
      }
      if (msg.fading) {
        msg.alpha -= dt * 2; // fade out speed
        if (msg.alpha <= 0) {
          this.messages.splice(i, 1);
        }
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const canvas = ctx.canvas;

    this.messages.forEach((msg, idx) => {
      ctx.save();
      ctx.globalAlpha = msg.alpha;
      ctx.font = msg.font;
      ctx.fillStyle = msg.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const x = msg.position?.x ?? canvas.width / 2;
      const baseY = canvas.height / 6;
      const spacing = 30; // vertical spacing between messages
      const y = msg.position?.y ?? (baseY + idx * spacing);

      ctx.fillText(msg.text, x, y);
      ctx.restore();
    });
  }
}
