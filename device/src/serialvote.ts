interface SerialDevice {
  onDataReceived(delimeter: string, cb: () => void): void;
  readUntil(delimeter: string): string;
  writeLine(line: string): void;
}

const serialDevice: SerialDevice = {
  onDataReceived: (delimeter, cb) => serial.onDataReceived(delimeter, cb),
  readUntil: (delimeter) => serial.readUntil(delimeter),
  writeLine: (line) => serial.writeLine(line),
};

const edgeSerialDevice: SerialDevice = {
  onDataReceived: (delimeter, cb) => edgeserial.onDataReceived(delimeter, cb),
  readUntil: (delimeter) => edgeserial.readUntil(delimeter),
  writeLine: (line) => edgeserial.writeLine(line),
};

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

  constructor(private readonly serial: SerialDevice, private readonly getDevices?: () => number[]) {
    const onDataReceived = () => this.onMessageReceived();
    this.serial.onDataReceived(SerialVoteDevice.DELIMETER, onDataReceived);
  }

  private onMessageReceived() {
    const line = this.serial.readUntil(SerialVoteDevice.DELIMETER);
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
    this.serial.writeLine(line);
  }

  setResults(results: number[]) {
    this.dispatch({ type: "RESULTS", results });
  }

  setDevices(devices: number[]) {
    this.dispatch({ type: "DEVICES", devices });
  }
}
