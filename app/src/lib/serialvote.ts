import { Microbit } from "./microbit";

export class SerialVoteDevice {
  constructor(private readonly microbit: Microbit) { }

  private dispatch(message: SerialVote.Message) {
    const line = JSON.stringify(message);
    return this.microbit.writeLine(line);
  }

  start(choices: number) {
    return this.dispatch({ type: "START", choices });
  }
}

