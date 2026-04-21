namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    destination: Buffers.uInt32LE.order(0),
    body: Buffers.buffer(Buffers.uInt8).order(1),
  });

  interface NetworkParentLayer {
    onReceivedBuffer(cb: (buffer: Buffer) => void): void;
    sendBuffer(buffer: Buffer): void;
  }

  export class NetworkManager {
    private readonly serialNumber = control.deviceSerialNumber();
    private receivedBufferCallback?: (buffer: Buffer) => void;

    onReceivedBuffer(cb: NetworkManager["receivedBufferCallback"]) {
      this.receivedBufferCallback = cb;
    }

    constructor(private readonly parent: NetworkParentLayer) {
      this.parent.onReceivedBuffer((buffer) => this.handleReceivedBuffer(buffer));
    }

    sendBuffer(destination: number, buffer: Buffer) {
      const packet = NetworkPacket.encode({ destination, body: buffer });
      this.parent.sendBuffer(packet);
    }

    private handleReceivedBuffer(buffer: Buffer) {
      const packet = NetworkPacket.decode(buffer);
      if (packet.destination != this.serialNumber) return;
      if (this.receivedBufferCallback)
        this.receivedBufferCallback(packet.body);
    }
  }
}
