import { Microbit } from "./microbit";

export class SerialVoteDevice {
  private resultsCallback?: (results: number[]) => void;

  onResults(callback: SerialVoteDevice["resultsCallback"]) {
    this.resultsCallback = callback;
  }

  constructor(private readonly microbit: Microbit) {
    this.loop();
  }

  private async loop() {
    const line = await this.microbit.readLine();
    const message = JSON.parse(line) as SerialVote.Message;
    switch (message.type) {
      case "RESULTS": return this.resultsCallback?.(message.results);
    }
  }

  private dispatch(message: SerialVote.Message) {
    const line = JSON.stringify(message);
    return this.microbit.writeLine(line);
  }

  start(choices: number) {
    return this.dispatch({ type: "START", choices });
  }
}

