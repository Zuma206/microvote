namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    dest: Buffers.uInt32.order(0),
    msg: Buffers.buffer(Buffers.uInt8).order(1),
  });

  const ME = control.deviceSerialNumber();
  const BROADCAST = 0;

  export class NetworkManager {
    private recievedBufferCallback = (buffer: Buffer) => { };

    onReceivedBuffer(cb: NetworkManager["recievedBufferCallback"]) {
      this.recievedBufferCallback = cb;
    }

    constructor(private readonly parent: Layer) {
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
      if (packet.dest !== ME && packet.dest !== BROADCAST) return;
      this.recievedBufferCallback(packet.msg);
    }

    sendBuffer(dest: number, msg: Buffer) {
      const packet = NetworkPacket.encode({
        dest,
        msg,
      });
      this.parent.sendBuffer(packet);
    }
  }
}
