// UIManager.js (Updated)
export class UIManager {
  constructor() {
    this.screens = {
      title: document.getElementById('title-screen'),
    };

    this.onModeSelected = null;
    this.onBack = null;
    this.handleClick = this.handleClick.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  init(onModeSelectedCallback, onBackCallback) {
    this.onModeSelected = onModeSelectedCallback;
    this.onBack = onBackCallback;

    const modeButtons = this.screens.title?.querySelectorAll('.mode-btn') || [];
    modeButtons.forEach(btn => btn.addEventListener('click', this.handleClick));

    // Add listener for back button
    const backButton = document.getElementById('back-btn');
    if (backButton) backButton.addEventListener('click', this.handleBack);
  }

  destroy() {
    console.log('UI destroy');
    Object.values(this.screens).forEach(screen => {
      if (!screen) return;
      const buttons = screen.querySelectorAll('button');
      buttons.forEach(btn => btn.removeEventListener('click', this.handleClick));
    });

    const backButton = document.getElementById('back-btn');
    if (backButton) backButton.removeEventListener('click', this.handleBack);
  }

  handleClick(e) {
    const mode = e.target.dataset.mode;
    if (this.onModeSelected && mode) {
      this.onModeSelected(mode);
    }
  }

  handleBack() {
    if (this.onBack) this.onBack();
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
