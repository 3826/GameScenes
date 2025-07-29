// In ClickCircleInstance.js
export class ClickCircleInstance {
    constructor(x, y, { lineWidth = 3, duration = 2, startRadius = 5, maxRadius = 35, dynamicLineWidth = false } = {}) {
        this.x = x;
        this.y = y;
        this.elapsed = 0;

        this.lineWidth = lineWidth;
        this.duration = duration;
        this.startRadius = startRadius;
        this.maxRadius = maxRadius;

        this.dynamicLineWidth = dynamicLineWidth;  // New flag
    }

    update(dt, isMouseDown) {
        this.elapsed += dt;
    }

    isExpired() {
        return this.elapsed >= this.duration;
    }

    getRadius() {
        const t = this.elapsed / this.duration;
        return t * (this.maxRadius - this.startRadius) + this.startRadius;
    }

    draw(ctx) {
        const radius = this.getRadius();
        ctx.beginPath();

        let currentLineWidth = this.lineWidth;
        if (this.dynamicLineWidth) {
            const t = this.elapsed / this.duration;
            currentLineWidth = this.lineWidth * (1 - t);
            if (currentLineWidth < 0) currentLineWidth = 0;
        }

        ctx.lineWidth = currentLineWidth;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgb(255, 255, 255)';
        ctx.stroke();
    }
}
