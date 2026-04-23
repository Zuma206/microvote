namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    dest: Buffers.uInt32LE.order(0),
    msg: Buffers.buffer(Buffers.uInt8).order(1),
  });

  const ME = control.deviceSerialNumber();

  export class NetworkManager {
    private readonly addresses: { [key: number]: NetworkLayer } = {};

    constructor(private readonly parent: Layer) {
      this.parent.onReceivedBuffer((buffer) => this.handleReceivedBuffer(buffer));
    }

    private handleReceivedBuffer(buffer: Buffer) {
      const packet = NetworkPacket.decode(buffer);
      if (packet.dest != ME) return;
      const src = radio.receivedSerial();
      if (!(src in this.addresses)) return;
      this.addresses[src].handleBuffer(packet.msg);
    }

    getAddress(address: number) {
      if (!(address in this.addresses))
        this.addresses[address] = new NetworkLayer(address, this.parent);
      return this.addresses[address];
    }

    deleteAddress(address: number) {
      delete this.addresses[address];
    }
  }

  class NetworkLayer implements Layer {
    private receivedBufferCallback?: (msg: Buffer) => void;

    onReceivedBuffer(cb: NetworkLayer["receivedBufferCallback"]) {
      this.receivedBufferCallback = cb;
    }

    constructor(private readonly dest: number, private readonly parent: Layer) { }

    sendBuffer(msg: Buffer): void {
      const packet = NetworkPacket.encode({ dest: this.dest, msg });
      this.parent.sendBuffer(packet);
    }

    handleBuffer(buffer: Buffer) {
      if (this.receivedBufferCallback)
        this.receivedBufferCallback(buffer);
    }
  }
}
