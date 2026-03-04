serial.setRxBufferSize(128);

const appManager = new Radiostack.ApplicationManager({
  onReceivedBuffer: radio.onReceivedBuffer,
  sendBuffer: radio.sendBuffer,
});
const serialVote = new SerialVoteDevice();

appManager.onResults((results) => serialVote.setResults(results));
serialVote.onStart((choices) => appManager.start(choices));
