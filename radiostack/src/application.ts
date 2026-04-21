namespace Radiostack {
  const ApplicationPacket = Buffers.struct({
    voteId: Buffers.uInt16LE.order(0),
    flags: Buffers.flags({ start: 0, cast: 1 }).order(1),
    n: Buffers.uInt8.order(2),
  });

  interface ApplicationParentLayer {
    onReceivedBuffer(cb: (buffer: Buffer) => void): void;
    sendBuffer(buffer: Buffer): void;
  }

  export class ApplicationManager {
    private resultsCallback?: (results: number[]) => void;
    private startCallback?: (choices: number) => void;
    private sequenceId = 0;
    private vote?: {
      results: number[],
      id: number,
    };

    constructor(private readonly parent: ApplicationParentLayer) {
      this.parent.onReceivedBuffer((buffer) => this.onReceivedBuffer(buffer));
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
      this.parent.sendBuffer(packet);
    }

    start(n: number) {
      const voteId = this.sequenceId++;
      const packet = ApplicationPacket.encode({
        flags: { start: true },
        voteId,
        n,
      });
      this.setStart(voteId, n);
      this.parent.sendBuffer(packet);
    }

    private onReceivedBuffer(buffer: Buffer) {
      const packet = ApplicationPacket.decode(buffer);
      if (packet.flags.start) {
        this.setStart(packet.voteId, packet.n);
      } else if (packet.flags.cast && this.vote && this.vote.id == packet.voteId) {
        this.vote.results[packet.n]++;
        if (this.resultsCallback) this.resultsCallback(this.vote.results);
      }
    }

    private setStart(id: number, n: number) {
      const results: number[] = [];
      for (let i = 0; i < n; i++) results.push(0);
      this.vote = { id, results };
      if (this.startCallback) this.startCallback(n);
    }
  }
}
