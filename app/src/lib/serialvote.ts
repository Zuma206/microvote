import { Microbit } from "./microbit";

type EventListener = (votes: number[]) => void;

export class SerialVoteConnection {
  private static id = 0;

  constructor(private readonly microbit: Microbit) {
    this.messageLoop();
  }

  private sendMessage(message: SerialVote.AppMessage) {
    return this.microbit.writeLine(JSON.stringify(message));
  }

  private currentVoteId: number | null = null;
  private eventListener?: EventListener;

  async start(options: number, eventListener?: EventListener) {
    await this.stop();
    this.currentVoteId = SerialVoteConnection.id++;
    this.eventListener = eventListener;
    await this.sendMessage({
      id: this.currentVoteId,
      type: "start",
      options,
    });
  }

  async stop() {
    if (this.currentVoteId === null) return;
    await this.stopId(this.currentVoteId);
    this.currentVoteId = null;
  }

  private stopId(id: number) {
    return this.sendMessage({
      type: "stop",
      id,
    });
  }

  private async messageLoop() {
    while (true) {
      const message = await this.readMessage();
      if (this.currentVoteId == null || message.id != this.currentVoteId) {
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

