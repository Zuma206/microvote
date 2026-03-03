class SerialVoteDevice {
  private static readonly DELIMETER = "\n";
  private startCallback?: (choices: number) => void;

  onStart(callback: SerialVoteDevice["startCallback"]) {
    this.startCallback = callback;
  }

  constructor() {
    const onDataReceived = () => this.onMessageReceived();
    serial.onDataReceived(SerialVoteDevice.DELIMETER, onDataReceived);
  }

  private onMessageReceived() {
    const line = serial.readUntil(SerialVoteDevice.DELIMETER);
    const message = JSON.parse(line) as SerialVote.Message;
    switch (message.type) {
      case "START": if (this.startCallback) this.startCallback(message.choices);
    }
  }
}
