namespace Radiostack {
  const MAX_SEQUENCE = 65535;

  export class ReliabilityMessageSender {
    private readonly initialSequence;
    private retryInterval?: number;
    private acked = 0;

    constructor(private readonly options: {
      onFinished: () => void,
      chunkSize: number,
      message: number,
      buffer: Buffer,
      parent: Layer,
    }) {
      if (this.options.buffer.length > MAX_SEQUENCE) control.fail("oversized buffer");
      const maxSequenceForBuffer = MAX_SEQUENCE - this.options.buffer.length;
      this.initialSequence = Math.randomRange(0, maxSequenceForBuffer);
      this.transmit();
    }

    private transmit(retries = 0) {
      if (this.acked >= this.options.buffer.length) return;
      const chunk = this.options.buffer.slice(this.acked, this.options.chunkSize);
      const packet = ReliabilityPacket.encode({
        flags: {
          fin: this.acked + chunk.length >= this.options.buffer.length,
          syn: this.acked == 0,
        },
        sequence: this.initialSequence + this.acked,
        message: this.options.message,
        chunk,
      });
      this.options.parent.sendBuffer(packet);
      this.retryInterval = control.setInterval(
        () => retries < RELIABILITY_RETRIES
          ? this.transmit(retries + 1)
          : this.options.onFinished(),
        ACK_TIMEOUT,
        control.IntervalMode.Timeout,
      );
    }

    acknowledge(sequence: number) {
      const expectedOffset = Math.min(this.acked + this.options.chunkSize, this.options.buffer.length);
      if (sequence != this.initialSequence + expectedOffset) return;
      this.acked = expectedOffset;
      if (this.retryInterval)
        control.clearInterval(this.retryInterval, control.IntervalMode.Timeout);
      this.transmit();
      if (this.acked >= this.options.buffer.length)
        this.options.onFinished();
    }
  }
}
