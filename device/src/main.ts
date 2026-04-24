// Setup radio
radio.setTransmitSerialNumber(true);
radio.setTransmitPower(7);
radio.setGroup(0);

// Setup radio protocols
const network = new Radiostack.NetworkManager(Radiostack.uBitRadio);
const voting = new Radiostack.ApplicationManager(network);

// Setup user interface
const ICON_LIFETIME = 1000;
const ui = new UserInterface(ICON_LIFETIME);

// Add voting plumming
voting.onStart((choices) => ui.start(choices));
voting.onIdentify(() => ui.identify());

// Add ui plumming
ui.onSelect((choice) => voting.cast(choice));
ui.onPair(() => voting.pair());
