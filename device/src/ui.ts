class UserInterface {
  private selectCallback?: (choice: number) => void;
  private pairCallback = () => { };
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
    this.choices = choices;
    this.selected = 0;
    this.render();
  }

  private render() {
    if (this.choices !== undefined) {
      const char = String.fromCharCode("A".charCodeAt(0) + this.selected);
      basic.showString(char);
    } else {
      basic.clearScreen();
    }
  }

  private right() {
    if (this.choices !== undefined) {
      this.selected++;
      if (this.selected >= this.choices)
        this.selected = 0;
    }
    this.render();
  }

  private left() {
    if (this.choices !== undefined) {
      this.selected--;
      if (this.selected < 0)
        this.selected = this.choices - 1;
    }
    this.render();
  }

  private select() {
    if (this.choices === undefined)
      return this.pairCallback();
    if (this.selectCallback) this.selectCallback(this.selected);
    this.choices = undefined;
    this.selected = 0;
    this.render();
  }

  onPair(pairedCallback: UserInterface["pairCallback"]) {
    this.pairCallback = pairedCallback;
  }
}
