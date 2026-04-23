namespace Radiostack {
  const DELETION_DELAY = 50;
  const BUFFER_NIL = control.createBuffer(0);

  export class ReliabilityMessageReceiver {
    private buffer: Buffer = control.createBuffer(0);
    private deletionInterval?: number;
    private initialSequence = 0;
    private finished = false;
    private synced = false;
    private delays = 0;

    constructor(private readonly options: {
      onReceivedBuffer: (buffer: Buffer) => void;
      onDeletion: () => void;
      message: number;
      parent: Layer;
    }) { }

    handlePacket(packet: ReliabilityPacket) {
      if (this.finished) return this.acknowledge();
      if (packet.flags.syn) return this.handleSyn(packet);
      this.handleData(packet);
    }

    private handleSyn(packet: ReliabilityPacket) {
      if (this.synced) {
        if (this.initialSequence === packet.sequence)
          return this.acknowledge();
        else
          return;
      }
      this.initialSequence = packet.sequence;
      this.buffer = packet.chunk;
      this.synced = true;
      this.finCheck(packet);
      this.acknowledge();
    }

    private handleData(packet: ReliabilityPacket) {
      const expectedSequence = this.getExpectedSequence();
      if (expectedSequence > packet.sequence)
        return this.acknowledge();
      if (expectedSequence < packet.sequence)
        return;
      this.buffer = this.buffer.concat(packet.chunk);
      this.finCheck(packet);
      this.acknowledge();
    }

    private getExpectedSequence() {
      return this.initialSequence + this.buffer.length;
    }

    private finCheck(packet: ReliabilityPacket) {
      if (!packet.flags.fin) return;
      this.finished = true;
      this.options.onReceivedBuffer(this.buffer);
      this.scheduleDeletion();
    }

    private scheduleDeletion() {
      this.deletionInterval = control.setInterval(
        () => this.options.onDeletion(),
        ACK_TIMEOUT + DELETION_DELAY,
        control.IntervalMode.Timeout,
      );
    }

    private delayDeletion() {
      if (!this.deletionInterval || this.delays >= RELIABILITY_RETRIES) return;
      control.clearInterval(this.deletionInterval, control.IntervalMode.Timeout);
      this.scheduleDeletion();
      this.delays++;
    }

    private acknowledge() {
      this.delayDeletion();
      const packet = ReliabilityPacket.encode({
        flags: { ack: true },
        message: this.options.message,
        sequence: this.getExpectedSequence(),
        chunk: BUFFER_NIL,
      });
      this.options.parent.sendBuffer(packet);
    }
  }
}
