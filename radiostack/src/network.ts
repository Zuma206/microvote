namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    dest: Buffers.uInt32LE.order(0),
    msg: Buffers.buffer(Buffers.uInt8).order(1),
  });

  const ME = control.deviceSerialNumber();
  const BROADCAST = 0;

  interface NetworkLayerPair {
    networkLayer: NetworkLayer;
    layer: Layer;
  }

  export class NetworkManager {
    private readonly addresses: { [key: number]: NetworkLayerPair } = {};
    private newConnectionCallback: (address: number) => void;
    private broadcastCallback = (device: number, buffer: Buffer) => { };

    onNewConnection(cb: NetworkManager["newConnectionCallback"]) {
      this.newConnectionCallback = cb;
    }

    onBroadcast(cb: NetworkManager["broadcastCallback"]) {
      this.broadcastCallback = cb;
    }

    constructor(private readonly parent: Layer, private readonly wrap = (layer: Layer) => layer) {
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
      this.parent.sendBuffer({ msg: packet });
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
        this.addresses[src].networkLayer.handleBuffer(packet.msg);
    }

    getAddress(address: number) {
      if (!has(this.addresses, address)) {
        const networkLayer = new NetworkLayer(address, this.parent);
        this.addresses[address] = { networkLayer, layer: this.wrap(networkLayer) };
      }
      return this.addresses[address].layer;
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

    sendBuffer(options: SendBufferOptions): void {
      const packet = NetworkPacket.encode({ dest: this.dest, msg: options.msg });
      this.parent.sendBuffer({
        onSuccess: options.onSuccess,
        onFailure: options.onFailure,
        msg: packet,
      });
    }

    handleBuffer(buffer: Buffer) {
      if (this.receivedBufferCallback)
        this.receivedBufferCallback(buffer);
    }
  }
}
