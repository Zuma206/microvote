serial.setRxBufferSize(128);

const appManager = new Radiostack.ApplicationManager(radio);
const serialVote = new SerialVoteDevice();

appManager.onResults((results) => serialVote.setResults(results));
serialVote.onStart((choices) => appManager.start(choices));
