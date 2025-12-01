import { Microbit } from "./microbit";
import { randomInteger } from "./utils";

type EventListener = (votes: number[]) => void;

export class SerialVoteConnection {
  private static id = randomInteger(0, Number.MAX_SAFE_INTEGER / 2);

  constructor(private readonly microbit: Microbit) {
    this.messageLoop();
  }

  private sendMessage(message: SerialVote.AppMessage) {
    return this.microbit.writeLine(JSON.stringify(message));
  }

  private currentVoteId: number | null = null;
  private eventListener?: EventListener;

  async start(options: number, eventListener?: EventListener) {
    if (this.currentVoteId !== null) await this.stop();
    this.currentVoteId = SerialVoteConnection.id++;
    this.eventListener = eventListener;
    await this.sendMessage({
      id: this.currentVoteId,
      type: "start",
      options,
    });
  }

  async stop() {
    if (this.currentVoteId)
      await this.stopId(this.currentVoteId);
  }

  private async stopId(id: number) {
    await this.sendMessage({
      type: "stop",
      id,
    });
    this.currentVoteId = null;
  }

  private async messageLoop() {
    if (!this.microbit.isOpen) this.microbit.open();
    while (true) {
      const message = await this.readMessage();
      if (message.id == null || message.id != this.currentVoteId) {
        await this.stopId(message.id);
        continue;
      }
      this.eventListener?.(message.votes);
    }
  }

  private async readMessage() {
    const line = await this.microbit.readLine();
    return JSON.parse(line) as SerialVote.HostMessage;
  }
}

