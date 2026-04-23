namespace Radiostack {
  export type ReliabilityPacket = typeof ReliabilityPacket.zero;
  export const ReliabilityPacket = Buffers.struct({
    flags: Buffers.flags({ ack: 0 }).order(0),
    id: Buffers.uInt16LE.order(1),
    msg: Buffers.buffer(Buffers.uInt8).order(2),
  });

  const BUFFER_NIL = control.createBuffer(0);
  const RELIABILITY_RETRY_AFTER = 200;
  const RELIABILITY_MAX_TRIES = 5;

  export class ReliabilityLayer implements Layer {
    private receivedMessages: { [key: number]: true } = {};
    private receivedBufferCallback?: (msg: Buffer) => void;
    private readonly queue: SendBufferOptions[] = [];
    private sendOptions?: SendBufferOptions;
    private retrySendInterval?: number;
    private id = 0;

    constructor(private readonly parent: Layer) {
      parent.onReceivedBuffer((buffer) => this.handleBuffer(buffer));
    }

    sendBuffer(options: SendBufferOptions): void {
      if (this.sendOptions !== undefined)
        return this.queue.push(options);
      this.sendNew(options);
    }

    onReceivedBuffer(cb: ReliabilityLayer["receivedBufferCallback"]): void {
      this.receivedBufferCallback = cb;
    }

    private sendNew(options: SendBufferOptions) {
      this.sendOptions = options;
      // increase id, wrapping around at the 16-bit integer limit,
      // as id is encoded as 16-bit
      this.id = (this.id + 1) & 0xFFFF;
      this.send(options, this.id, 0);
    }

    private send(options: SendBufferOptions, id: number, tries: number) {
      if (tries >= RELIABILITY_MAX_TRIES)
        return this.doneSending(false);
      this.retrySendInterval = control.setInterval(
        () => this.send(options, id, tries + 1),
        RELIABILITY_RETRY_AFTER,
        control.IntervalMode.Timeout,
      );
      const packet = ReliabilityPacket.encode({
        msg: options.msg,
        flags: {},
        id,
      });
      this.parent.sendBuffer({ msg: packet });
    }

    private handleBuffer(buffer: Buffer) {
      const packet = ReliabilityPacket.decode(buffer);
      if (packet.flags.ack === true)
        return this.handleAck(packet.id);
      this.handleMessage(packet.id, packet.msg);
    }

    private handleAck(id: number) {
      if (id !== this.id) return;
      if (this.retrySendInterval !== undefined)
        control.clearInterval(this.retrySendInterval, control.IntervalMode.Timeout);
      this.doneSending(true);
    }

    private doneSending(success: boolean) {
      this.retrySendInterval = undefined;
      this.sendOptions = undefined;
      this.doneCallback(success);
      if (this.queue.length <= 0) return;
      const msg = this.queue[0];
      this.queue.splice(0, 1);
      this.sendNew(msg);
    }

    private doneCallback(success: boolean) {
      if (!this.sendOptions) return;
      if (success == true && this.sendOptions.onSuccess !== undefined)
        this.sendOptions.onSuccess();
      else if (success == false && this.sendOptions.onFailure !== undefined)
        this.sendOptions.onFailure();
    }

    private handleMessage(id: number, msg: Buffer) {
      this.ack(id);
      if (id in this.receivedMessages) return;
      if (this.receivedBufferCallback !== undefined)
        this.receivedBufferCallback(msg);
      control.setInterval(
        () => { delete this.receivedMessages[id] },
        // wait double the amount of time the sender will keep retrying for,
        // after which, we may treat packets with this ID as new rather than retries
        RELIABILITY_RETRY_AFTER * RELIABILITY_MAX_TRIES * 2,
        control.IntervalMode.Timeout,
      );
      this.receivedMessages[id] = true;
    }

    private ack(id: number) {
      const packet = ReliabilityPacket.encode({
        flags: { ack: true },
        msg: BUFFER_NIL,
        id,
      });
      this.parent.sendBuffer({ msg: packet });
    }
  }
}
