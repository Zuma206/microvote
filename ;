// Setup Serial
const SERIAL_BUFFER_SIZE = 128;
serial.setBaudRate(BaudRate.BaudRate115200);
serial.setRxBufferSize(SERIAL_BUFFER_SIZE);
serial.setTxBufferSize(SERIAL_BUFFER_SIZE);

// Setup radio
radio.setTransmitSerialNumber(true);
radio.setTransmitPower(7);
radio.setGroup(0);

// Setup participant storage
const participants: number[] = [];

// Setup radio protocols
const network = new Radiostack.NetworkManager(Radiostack.uBitRadio);
const voting = new Radiostack.ApplicationManager(network, participants);

// Setup serialvote devices
const webApp = new SerialVoteDevice(participants);

// Setup user interface
const ICON_LIFETIME = 1000;
const ui = new UserInterface(ICON_LIFETIME);

// Add web app plumming
webApp.onIdentify((address) => voting.identify(address));
webApp.onStart((choices) => voting.start(choices));
webApp.onRemove((address) => {
  const index = participants.find((value) => value === address);
  if (index === undefined || index < 0) return;
  participants.splice(index, 1);
  webApp.updateDevices();
});

// Add voting plumming
voting.onResults((results) => webApp.setResults(results));
voting.onStart((choices) => ui.start(choices));
voting.onIdentify(() => ui.identify());
voting.onFailure(() => ui.failure());
voting.onSuccess(() => ui.success());
voting.onPair((device) => {
  if (participants.find((d) => d === device) !== undefined)
    return;
  participants.push(device);
  webApp.updateDevices();
  ui.paired();
});

// Add ui plumming
ui.onSelect((choice) => voting.cast(choice));
ui.onPair(() => voting.pair());
