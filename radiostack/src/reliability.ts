namespace Radiostack {
  export type ReliabilityPacket = typeof ReliabilityPacket.zero;
  export const ReliabilityPacket = Buffers.struct({
    flags: Buffers.flags({ syn: 0, ack: 1, fin: 2 }).order(0),
    message: Buffers.uInt16LE.order(1),
    sequence: Buffers.uInt16LE.order(2),
    chunk: Buffers.buffer(Buffers.uInt8).order(3),
  });

  export const ACK_TIMEOUT = 150,
    RELIABILITY_RETRIES = 5;

  export class ReliabilityLayer implements Layer {
    private receivers: { [key: number]: ReliabilityMessageReceiver } = {};
    private receivedBufferCallback?: (buffer: Buffer) => void;
    private sender?: ReliabilityMessageSender;
    private queue: Buffer[] = [];
    private message = 0;

    onReceivedBuffer(cb: (receivedBuffer: Buffer) => void): void {
      this.receivedBufferCallback = cb;
    }

    constructor(private readonly parent: Layer, private readonly overhead: number) {
      parent.onReceivedBuffer((buffer) => this.handleBuffer(buffer));
    }

    private handleBuffer(buffer: Buffer) {
      const packet = ReliabilityPacket.decode(buffer);
      if (packet.flags.ack && packet.message == this.message && this.sender)
        return this.sender.acknowledge(packet.sequence);
      else if (packet.flags.syn && !(packet.message in this.receivers))
        this.receivers[packet.message] = this.newReceiver(packet.message);
      if (packet.message in this.receivers)
        this.receivers[packet.message].handlePacket(packet);
    }

    private newReceiver(message: number) {
      return new ReliabilityMessageReceiver({
        onDeletion: () => {
          delete this.receivers[message];
        },
        onReceivedBuffer: (buffer) => {
          if (this.receivedBufferCallback)
            this.receivedBufferCallback(buffer);
        },
        parent: this.parent,
        message,
      });
    }

    sendBuffer(buffer: Buffer): void {
      if (this.sender !== undefined)
        this.queue.push(buffer);
      else
        this.sender = new ReliabilityMessageSender({
          onFinished: () => this.finishSend(),
          chunkSize: RADIO_MAX_BUFFER_SIZE - this.overhead,
          message: ++this.message,
          parent: this.parent,
          buffer,
        });
    }

    private finishSend() {
      this.sender = undefined;
      if (this.queue.length == 0)
        return;
      const buffer = this.queue[0];
      this.queue.splice(0, 1);
      this.sendBuffer(buffer);
    }
  }
}
