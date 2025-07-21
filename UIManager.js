export class UIManager {
  constructor() {
    this.screens = {
      title: document.getElementById('title-screen'),
      // other screens can be added here later
    };

    this.onModeSelected = null;
    this.handleClick = this.handleClick.bind(this);
  }

  init(onModeSelectedCallback) {
    this.onModeSelected = onModeSelectedCallback;

    // Attach click listeners to mode buttons on the title screen
    const modeButtons = this.screens.title?.querySelectorAll('.mode-btn') || [];
    modeButtons.forEach(btn => btn.addEventListener('click', this.handleClick));
  }

  destroy() {
    Object.values(this.screens).forEach(screen => {
      if (!screen) return;
      const buttons = screen.querySelectorAll('button');
      buttons.forEach(btn => btn.removeEventListener('click', this.handleClick));
    });
  }

  handleClick(e) {
    const mode = e.target.dataset.mode;
    if (this.onModeSelected && mode) {
      this.onModeSelected(mode);
    }
  }

  show(screenName) {
    const screen = this.screens[screenName];
    if (screen) screen.style.display = 'flex';
  }

  hide(screenName) {
    const screen = this.screens[screenName];
    if (screen) screen.style.display = 'none';
  }

  setCursor(pointer) {
    document.body.style.cursor = pointer ? 'pointer' : 'default';
  }
}
