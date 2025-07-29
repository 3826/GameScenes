  constructor(x, y, duration = 2, startRadius = 5,maxRadius = 35) 
  {
    this.x = x;
    this.y = y;

    this.duration = duration;
    this.startRadius = startRadius;
    this.maxRadius = maxRadius;

    this.elapsed = 0;
    this.isPaused = false;
  }