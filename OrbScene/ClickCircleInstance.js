//OrbScene/ClickCircleInstance.js
export class ClickCircleInstance {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.elapsed = 0;
        this.duration = 2;
        this.startRadius = 5;
        this.maxRadius = 33;
        this.isPaused = false;
    }

    update(dt, isMouseDown) {
        if (!this.isPaused) this.elapsed += dt;
        if (!isMouseDown) this.isPaused = false;
    }

    isExpired() {
        return this.elapsed >= this.duration;
    }

    getRadius() {
        const t = this.elapsed / this.duration;
        return t * this.maxRadius + this.startRadius;
    }

    draw(ctx) {
        const radius = this.getRadius();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgb(255, 255, 255)';;
        ctx.stroke();
    }
}
