const SERIAL_BUFFER_SIZE = 128;
serial.setRxBufferSize(SERIAL_BUFFER_SIZE);
serial.setTxBufferSize(SERIAL_BUFFER_SIZE);

const appManager = new Radiostack.ApplicationManager(Radiostack.ubitRadio);
const serialVote = new SerialVoteDevice();

appManager.onResults((results) => {
  renderResults(results);
  serialVote.setResults(results);
});

serialVote.onStart((choices) => {
  renderResults([]);
  appManager.start(choices);
});
