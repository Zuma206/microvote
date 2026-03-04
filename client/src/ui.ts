class UserInterface {
  private selectCallback?: (choice: number) => void;
  private choices?: number;
  private selected = 0;

  onSelect(callback: UserInterface["selectCallback"]) {
    this.selectCallback = callback;
  }

  constructor() {
    input.onButtonPressed(Button.A, () => this.left());
    input.onButtonPressed(Button.B, () => this.right());
    input.onButtonPressed(Button.AB, () => this.select());
  }

  start(choices: number) {
    this.selected = 0;
    this.choices = choices;
    this.render();
  }

  private render() {
    if (this.choices) {
      const char = String.fromCharCode("A".charCodeAt(0) + this.selected);
      basic.showString(char);
    } else {
      basic.clearScreen();
    }
  }

  private left() {
    if (this.choices) {
      this.selected++;
      if (this.selected >= this.choices)
        this.selected = 0;
    }
    this.render();
  }

  private right() {
    if (this.choices) {
      this.selected--;
      if (this.selected < 0)
        this.selected = this.choices - 1;
    }
    this.render();
  }

  private select() {
    this.choices = 0;
    if (this.selectCallback) this.selectCallback(this.selected);
    this.choices = undefined;
    this.render();
  }
}
