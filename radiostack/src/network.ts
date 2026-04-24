namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    dest: Buffers.uInt32LE.order(0),
    msg: Buffers.buffer(Buffers.uInt8).order(1),
  });

  const ME = control.deviceSerialNumber();

  interface NetworkLayerPair {
    networkLayer: NetworkLayer;
    layer: Layer;
  }

  export class NetworkManager {
    private readonly addresses: { [key: number]: NetworkLayerPair } = {};
    private newConnectionCallback: (address: number) => void;

    onNewConnection(cb: NetworkManager["newConnectionCallback"]) {
      this.newConnectionCallback = cb;
    }

    constructor(private readonly parent: Layer, private readonly wrap = (layer: Layer) => layer) {
      this.newConnectionCallback = (address: number) => {
        // By default, delete new connections
        this.deleteAddress(address);
      };
      this.parent.onReceivedBuffer((buffer) => this.handleReceivedBuffer(buffer));
    }

    private handleReceivedBuffer(buffer: Buffer) {
      const packet = NetworkPacket.decode(buffer);
      if (packet.dest != ME) return;
      const src = radio.receivedSerial();
      if (!(src in this.addresses)) {
        this.getAddress(src);
        this.newConnectionCallback(src);
      }
      // necessary check, address may have been deleted in newConnectionCallback
      if (src in this.addresses)
        this.addresses[src].networkLayer.handleBuffer(packet.msg);
    }

    getAddress(address: number) {
      if (!(address in this.addresses)) {
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
