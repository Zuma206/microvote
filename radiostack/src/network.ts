namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    destination: Buffers.uInt32LE.order(0),
    body: Buffers.buffer(Buffers.uInt8).order(1),
  });

  interface NetworkParentLayer {
    onReceivedBuffer(cb: (buffer: Buffer) => void): void;
    sendBuffer(buffer: Buffer): void;
  }
}
