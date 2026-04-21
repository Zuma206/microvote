namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    dest: Buffers.uInt32LE.order(0),
    msg: Buffers.buffer(Buffers.uInt8).order(1),
  });

  export class NetworkManager implements Layer {
    private readonly serialNumber = control.deviceSerialNumber();
    private receivedBufferCallback?: (msg: Buffer) => void;

    onReceivedBuffer(cb: NetworkManager["receivedBufferCallback"]) {
      this.receivedBufferCallback = cb;
    }

    constructor(private readonly dest: number, private readonly parent: Layer) {
      this.parent.onReceivedBuffer((buffer) => this.handleReceivedBuffer(buffer));
    }

    sendBuffer(msg: Buffer): void {
      const packet = NetworkPacket.encode({ dest: this.dest, msg });
      this.parent.sendBuffer(packet);
    }

    private handleReceivedBuffer(buffer: Buffer) {
      const packet = NetworkPacket.decode(buffer);
      if (packet.dest != this.serialNumber) return;
      if (this.receivedBufferCallback)
        this.receivedBufferCallback(packet.msg);
    }
  }
}
