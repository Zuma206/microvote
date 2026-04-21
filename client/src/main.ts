const appManager = new Radiostack.ApplicationManager(Radiostack.uBitRadio);
const ui = new UserInterface();

appManager.onStart((choices) => ui.start(choices));
ui.onSelect((choice) => appManager.cast(choice));
