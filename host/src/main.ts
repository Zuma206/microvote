serial.setRxBufferSize(128);

Reliable.sayHello();

const serialVote = new SerialVoteConnection();

let currentOptions: number | undefined;

serialVote.onStart = (options) => {
  currentOptions = options;
  basic.showString("start");
}

serialVote.onStop = () => {
  currentOptions = undefined;
  basic.showString("stop");
}

input.onButtonPressed(Button.A, () => {
  if (currentOptions === undefined) return;
  const votes: number[] = [];
  for (let i = 0; i < currentOptions; i++) {
    votes.push(Math.round(Math.randomRange(0, 50)));
  }
  serialVote.update(votes);
});

