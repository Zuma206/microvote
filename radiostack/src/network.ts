namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    dest: Buffers.uInt32.order(0),
    msg: Buffers.buffer(Buffers.uInt8).order(1),
  });

  const ME = control.deviceSerialNumber();
  const BROADCAST = 0;

  export class NetworkManager {
    private readonly addresses: { [key: number]: NetworkLayer } = {};
    private newConnectionCallback: (address: number) => void;
    private broadcastCallback = (device: number, buffer: Buffer) => { };

    onNewConnection(cb: NetworkManager["newConnectionCallback"]) {
      this.newConnectionCallback = cb;
    }

    onBroadcast(cb: NetworkManager["broadcastCallback"]) {
      this.broadcastCallback = cb;
    }

    constructor(private readonly parent: Layer) {
      this.newConnectionCallback = (address: number) => {
        // By default, delete new connections
        this.deleteAddress(address);
      };
      this.parent.onReceivedBuffer((buffer) => this.handleReceivedBuffer(buffer));
    }

    broadcast(msg: Buffer) {
      const packet = NetworkPacket.encode({
        dest: BROADCAST,
        msg,
      });
      this.parent.sendBuffer(packet);
    }

    private handleReceivedBuffer(buffer: Buffer) {
      const packet = NetworkPacket.decode(buffer);
      const src = radio.receivedSerial();
      if (packet.dest === BROADCAST)
        return this.broadcastCallback(src, packet.msg);
      if (packet.dest !== ME) return;
      if (!has(this.addresses, src)) {
        this.getAddress(src);
        this.newConnectionCallback(src);
      }
      // necessary check, address may have been deleted in newConnectionCallback
      if (has(this.addresses, src))
        this.addresses[src].handleBuffer(packet.msg);
    }

    getAddress(address: number) {
      if (!has(this.addresses, address))
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

    sendBuffer(buffer: Buffer): void {
      const packet = NetworkPacket.encode({ dest: this.dest, msg: buffer });
      this.parent.sendBuffer(packet);
    }

    handleBuffer(buffer: Buffer) {
      if (this.receivedBufferCallback)
        this.receivedBufferCallback(buffer);
    }
  }
}
