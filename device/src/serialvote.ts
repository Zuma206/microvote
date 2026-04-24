interface SerialDevice {
  onDataReceived(delimeter: string, cb: () => void): void;
  readUntil(delimeter: string): string;
  writeLine(line: string): void;
}

const usbSerial: SerialDevice = {
  onDataReceived: (delimeter, cb) => serial.onDataReceived(delimeter, cb),
  readUntil: (delimeter) => serial.readUntil(delimeter),
  writeLine: (line) => serial.writeLine(line),
};

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

  constructor(private readonly serial: SerialDevice) {
    const onDataReceived = () => this.onMessageReceived();
    this.serial.onDataReceived(SerialVoteDevice.DELIMETER, onDataReceived);
  }

  private onMessageReceived() {
    const line = this.serial.readUntil(SerialVoteDevice.DELIMETER);
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
    this.serial.writeLine(line);
  }

  setResults(results: number[]) {
    this.dispatch({ type: "RESULTS", results });
  }

  setDevices(devices: number[]) {
    this.dispatch({ type: "DEVICES", devices });
  }
}
