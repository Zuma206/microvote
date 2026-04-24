class SerialVoteDevice {
  private static readonly DELIMETER = "\n";
  private startCallback = (choices: number) => { };
  private identifyCallback = (device: number) => { };
  private removeCallback = (device: number) => { };
  private pairCallback = (device: number) => { };

  onStart(callback: SerialVoteDevice["startCallback"]) {
    this.startCallback = callback;
  }

  onIdentify(callback: SerialVoteDevice["identifyCallback"]) {
    this.identifyCallback = callback;
  }

  onRemove(callback: SerialVoteDevice["removeCallback"]) {
    this.removeCallback = callback;
  }

  onPair(callback: SerialVoteDevice["pairCallback"]) {
    this.pairCallback = callback;
  }

  constructor(private readonly getDevices?: () => number[]) {
    const onDataReceived = () => this.onMessageReceived();
    serial.onDataReceived(SerialVoteDevice.DELIMETER, onDataReceived);
  }

  private onMessageReceived() {
    const line = serial.readUntil(SerialVoteDevice.DELIMETER);
    const message = JSON.parse(line) as SerialVote.Message;
    switch (message.type) {
      case "START":
        return this.startCallback(message.choices);
      case "IDENTIFY":
        return this.identifyCallback(message.device);
      case "REMOVE":
        return this.removeCallback(message.device);
      case "DEVICES":
        return this.devices();
      case "PAIR":
        return this.pairCallback(message.device);
    }
  }

  private devices() {
    if (this.getDevices !== undefined)
      this.setDevices(this.getDevices());
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

  pair() {
    this.dispatch({ type: "PAIR", device: control.deviceSerialNumber() });
  }
}
