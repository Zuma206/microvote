import { Microbit } from "./microbit";

export class SerialVoteDevice {
  private resultsCallback?: (results: number[]) => void;
  private devicesCallback?: (devices: number[]) => void;

  onResults(callback: SerialVoteDevice["resultsCallback"]) {
    this.resultsCallback = callback;
  }

  onDevices(callback: SerialVoteDevice["devicesCallback"]) {
    this.devicesCallback = callback;
  }

  constructor(private readonly microbit: Microbit) {
    this.loop();
  }

  private async loop() {
    const line = await this.microbit.readLine();
    const message = JSON.parse(line) as SerialVote.Message;
    switch (message.type) {
      case "RESULTS": return this.resultsCallback?.(message.results);
      case "DEVICES": return this.devicesCallback?.(message.devices);
    }
  }

  private dispatch(message: SerialVote.Message) {
    const line = JSON.stringify(message);
    return this.microbit.writeLine(line);
  }

  start(choices: number) {
    return this.dispatch({ type: "START", choices });
  }

  identify(device: number) {
    return this.dispatch({ type: "IDENTIFY", device });
  }

  remove(device: number) {
    return this.dispatch({ type: "REMOVE", device });
  }
}

