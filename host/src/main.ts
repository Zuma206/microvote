serial.setRxBufferSize(128);

const serialVote = new SerialVoteDevice();

serialVote.onStart((choices) => {
  basic.showNumber(choices);
});
