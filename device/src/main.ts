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
const participants = new Storage<number[]>("participants", []);
const getParticipants = () => participants.get();

// Setup radio protocols
const wrapLayer = (layer: Radiostack.Layer) => new Radiostack.ReliabilityLayer(layer);
const network = new Radiostack.NetworkManager(Radiostack.uBitRadio, wrapLayer);
const voting = new Radiostack.ApplicationManager(network, getParticipants);

// Setup serialvote devices
const webApp = new SerialVoteDevice(getParticipants);

// Setup user interface
const ICON_LIFETIME = 1000;
const ui = new UserInterface(ICON_LIFETIME);

// Add web app plumming
webApp.onIdentify((address) => voting.identify(address));
webApp.onStart((choices) => voting.start(choices));
webApp.onRemove((address) => {
  const newParticipants = participants.get().filter((i) => address !== i);
  participants.set(newParticipants);
  webApp.setDevices(newParticipants);
});

// Add voting plumming
voting.onResults((results) => webApp.setResults(results));
voting.onStart((choices) => ui.start(choices));
voting.onIdentify(() => ui.identify());
voting.onFailure(() => ui.failure());
voting.onSuccess(() => ui.success());

// Add ui plumming
ui.onSelect((choice) => voting.cast(choice));
