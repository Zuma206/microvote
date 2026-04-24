// Setup Serial
const SERIAL_BUFFER_SIZE = 128;
edgeserial.redirect(EdgeSerialPin.P0, EdgeSerialPin.P1, EdgeBaudRate.BaudRate115200);
edgeserial.setRxBufferSize(SERIAL_BUFFER_SIZE);
edgeserial.setTxBufferSize(SERIAL_BUFFER_SIZE);
serial.setBaudRate(BaudRate.BaudRate115200);
serial.setRxBufferSize(SERIAL_BUFFER_SIZE);
serial.setTxBufferSize(SERIAL_BUFFER_SIZE);

// Setup radio
radio.setTransmitSerialNumber(true);
radio.setTransmitPower(8);
radio.setGroup(0);

// Setup participant storage
const participants = new Storage<number[]>("participants", []);
const getParticipants = () => participants.get();

// Setup radio protocols
const wrapLayer = (layer: Radiostack.Layer) => new Radiostack.ReliabilityLayer(layer);
const network = new Radiostack.NetworkManager(Radiostack.uBitRadio, wrapLayer);
const voting = new Radiostack.ApplicationManager(network, getParticipants);

// Setup serialvote devices
const webApp = new SerialVoteDevice(serialDevice, getParticipants);
const pairingDevice = new SerialVoteDevice(edgeSerialDevice);

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

// Add paring device plumming
pairingDevice.onPair((device) => {
  const newParticipants = participants.get();
  if (newParticipants.find((i) => i === device) !== undefined)
    return;
  newParticipants.push(device);
  participants.set(newParticipants);
  webApp.setDevices(newParticipants);
  ui.paired();
});

// Send pairing messages
const PAIRING_DELAY = 500;
control.setInterval(
  () => pairingDevice.pair(),
  PAIRING_DELAY,
  control.IntervalMode.Interval,
);
