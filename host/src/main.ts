serial.setRxBufferSize(128);

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
