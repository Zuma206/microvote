namespace Radiostack {
  export const ApplicationPacket = Buffers.struct({
    voteId: Buffers.uInt16LE.order(0),
    flags: Buffers.flags({ start: 0, cast: 1 }).order(1),
    n: Buffers.uInt8.order(2),
  });

  export class ApplicationManager {
    private resultsCallback?: (results: number[]) => void;
    private startCallback?: (choices: number) => void;
    private sequenceId = 0;
    private vote?: {
      results: number[],
      id: number,
    };

    constructor(private readonly radio: Layer) {
      this.radio.onReceivedBuffer((buffer) => this.onReceivedBuffer(buffer));
    }

    onResults(callback: ApplicationManager["resultsCallback"]) {
      this.resultsCallback = callback;
    }

    onStart(callback: ApplicationManager["startCallback"]) {
      this.startCallback = callback;
    }

    cast(n: number) {
      if (!this.vote) return;
      const packet = ApplicationPacket.encode({
        voteId: this.vote.id,
        flags: { cast: true },
        n,
      });
      this.radio.sendBuffer(packet);
    }

    start(n: number) {
      const packet = ApplicationPacket.encode({
        voteId: this.sequenceId++,
        flags: { start: true },
        n,
      });
      this.radio.sendBuffer(packet);
    }

    private onReceivedBuffer(buffer: Buffer) {
      const packet = ApplicationPacket.decode(buffer);
      if (packet.flags.start) {
        const results: number[] = [];
        for (let i = 0; i < packet.n; i++) results.push(0);
        this.vote = { id: packet.voteId, results };
        if (this.startCallback) this.startCallback(packet.n);
      } else if (packet.flags.cast && this.vote && this.vote.id == packet.voteId) {
        this.vote.results[packet.n]++;
        if (this.resultsCallback) this.resultsCallback(this.vote.results);
      }
    }
  }
}
