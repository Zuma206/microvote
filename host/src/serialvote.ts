class SerialVoteDevice {
  private static readonly DELIMETER = "\n";
  private startCallback = (choices: number) => { };

  onStart(callback: SerialVoteDevice["startCallback"]) {
    this.startCallback = callback;
  }

  constructor(private readonly participants: number[]) {
    const onDataReceived = () => this.onMessageReceived();
    serial.onDataReceived(SerialVoteDevice.DELIMETER, onDataReceived);
  }

  private onMessageReceived() {
    const line = serial.readUntil(SerialVoteDevice.DELIMETER);
    const message = JSON.parse(line) as SerialVote.Message;
    switch (message.type) {
      case "START":
        return this.startCallback(message.choices);
      case "DEVICES":
        return this.updateDevices();
    }
  }

  private dispatch(message: SerialVote.Message) {
    const line = JSON.stringify(message);
    serial.writeLine(line);
  }

  setResults(results: number[]) {
    this.dispatch({ type: "RESULTS", results });
  }

  updateDevices() {
    this.dispatch({ type: "DEVICES", devices: this.participants });
  }
}
