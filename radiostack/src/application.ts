namespace Radiostack {
  type ApplicationPacket = typeof ApplicationPacket.zero;
  const ApplicationPacket = Buffers.struct({
    id: Buffers.uInt16LE.order(0),
    flags: Buffers.flags({ start: 0 }).order(1),
    n: Buffers.uInt8.order(2),
  });

  function newResults(n: number) {
    const results: number[] = [];
    for (let i = 0; i < n; i++) {
      results.push(0);
    }
    return results;
  }

  export class ApplicationManager {
    private voteParticipation?: { host: number, id: number };
    private voteHosting?: { id: number, results: number[] };
    private resultsCallback?: (results: number[]) => void;
    private startCallback?: (choices: number) => void;
    private successCallback?: () => void;
    private failureCallback?: () => void;
    private sequenceId = 0;

    constructor(private readonly network: NetworkManager, private readonly getParticipants: () => number[]) {
      network.onNewConnection((address) => {
        network.getAddress(address).onReceivedBuffer((buffer) => {
          this.handlePacket(address, buffer);
        });
      });
    }

    onSuccess(callback: ApplicationManager["successCallback"]) {
      this.successCallback = callback;
    }

    onFailure(callback: ApplicationManager["failureCallback"]) {
      this.failureCallback = callback;
    }

    onResults(callback: ApplicationManager["resultsCallback"]) {
      this.resultsCallback = callback;
    }

    onStart(callback: ApplicationManager["startCallback"]) {
      this.startCallback = callback;
    }

    cast(n: number) {
      if (this.voteParticipation === undefined) return;
      const packet = ApplicationPacket.encode({
        id: this.voteParticipation.id,
        flags: {},
        n,
      });
      const host = this.network.getAddress(this.voteParticipation.host);
      host.sendBuffer({
        onFailure: this.failureCallback,
        onSuccess: this.successCallback,
        msg: packet,
      });
      this.voteParticipation = undefined;
    }

    start(n: number) {
      const id = this.sequenceId++;
      const packet = ApplicationPacket.encode({
        flags: { start: true },
        id: id,
        n,
      });
      this.voteHosting = { id, results: newResults(n) };
      this.getParticipants().forEach(participant => {
        const layer = this.network.getAddress(participant);
        layer.sendBuffer({ msg: packet });
      });
    }

    private handlePacket(address: number, buffer: Buffer) {
      const packet = ApplicationPacket.decode(buffer);
      if (packet.flags.start === true)
        return this.handleStart(address, packet);
      this.handleCast(packet);
    }

    private handleStart(address: number, packet: ApplicationPacket) {
      this.voteParticipation = { host: address, id: packet.id };
      if (this.startCallback !== undefined)
        this.startCallback(packet.n);
    }

    private handleCast(packet: ApplicationPacket) {
      if (this.voteHosting === undefined ||
        this.voteHosting.id != packet.id ||
        packet.n < 0 || packet.n >= this.voteHosting.results.length)
        return;
      this.voteHosting.results[packet.n]++;
      if (this.resultsCallback !== undefined)
        this.resultsCallback(this.voteHosting.results);
    }
  }
}
