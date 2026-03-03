class SerialVoteDevice {
  private static readonly DELIMETER = "\n";
  private startCallback?: (choices: number) => void;
  private identifyCallback?: (device: number) => void;
  private removeCallback?: (device: number) => void;

  onStart(callback: SerialVoteDevice["startCallback"]) {
    this.startCallback = callback;
  }

  onIdentify(callback: SerialVoteDevice["identifyCallback"]) {
    this.identifyCallback = callback;
  }

  onRemove(callback: SerialVoteDevice["removeCallback"]) {
    this.removeCallback = callback;
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
        break;
      case "IDENTIFY": if (this.identifyCallback) return this.identifyCallback(message.device);
        break;
      case "REMOVE": if (this.removeCallback) return this.removeCallback(message.device);
        break;
    }
  }

  private dispatch(message: SerialVote.Message) {
    const line = JSON.stringify(message);
    serial.writeLine(line);
  }

  setResults(results: number[]) {
    this.dispatch({ type: "RESULTS", results });
  }

  setDevices(devices: number[]) {
    this.dispatch({ type: "DEVICES", devices });
  }
}
