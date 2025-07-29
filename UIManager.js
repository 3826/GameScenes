export class UIManager {
  constructor() {
    this.screens = {
      title: document.getElementById('title-screen'),
      pause: document.getElementById('pause-screen'),
    };

    this.onModeSelected = null;
    this.onBack = null;
    this.onResume = null;

    this.handleClick = this.handleClick.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleResume = this.handleResume.bind(this);
  }

  init(onModeSelectedCallback, onBackCallback, onResumeCallback) {
    this.onModeSelected = onModeSelectedCallback;
    this.onBack = onBackCallback;
    this.onResume = onResumeCallback;

    const modeButtons = this.screens.title?.querySelectorAll('.mode-btn') || [];
    modeButtons.forEach(btn => btn.addEventListener('click', this.handleClick));

    const backButton = document.getElementById('back-btn');
    if (backButton) backButton.addEventListener('click', this.handleBack);

    const resumeButton = document.getElementById('resume-btn');
    if (resumeButton) resumeButton.addEventListener('click', this.handleResume);
  }

  handleClick(e) {
    const mode = e.target.dataset.mode;
    if (this.onModeSelected && mode) {
      this.onModeSelected(mode);
    }
  }

  handleBack() {
    if (typeof this.onBack === 'function') {
      this.onBack();
    }
  }

  handleResume() {
    if (typeof this.onResume === 'function') {
      this.onResume();
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

  showOnly(screenName) {
    Object.entries(this.screens).forEach(([name, screen]) => {
      if (!screen) return;
      screen.style.display = name === screenName ? 'flex' : 'none';
    });
  }

  setCursor(pointer) {
    document.body.style.cursor = pointer ? 'pointer' : 'default';
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

    const resumeButton = document.getElementById('resume-btn');
    if (resumeButton) resumeButton.removeEventListener('click', this.handleResume);
  }
}
