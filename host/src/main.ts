// Setup Serial
const SERIAL_BUFFER_SIZE = 128;
serial.setRxBufferSize(SERIAL_BUFFER_SIZE);
serial.setTxBufferSize(SERIAL_BUFFER_SIZE);

// Setup radio
radio.setTransmitSerialNumber(true);
radio.setGroup(0);

// Setup participant storage
const participants: number[] = [];

// Setup radio protocols
const network = new Radiostack.NetworkManager(Radiostack.uBitRadio);
const voting = new ApplicationManager(network, participants);

// Setup serialvote devices
const webApp = new SerialVoteDevice(participants);

// Add web app plumming
webApp.onStart((choices) => voting.start(choices));

// Add voting plumming
voting.onResults((results) => webApp.setResults(results));
voting.onPair((device) => {
  if (participants.indexOf(device) >= 0) return;
  participants.push(device);
  webApp.updateDevices();
});
