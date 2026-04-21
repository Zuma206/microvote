namespace Radiostack {
  const NetworkPacket = Buffers.struct({
    destination: Buffers.uInt32LE.order(0),
    body: Buffers.buffer(Buffers.uInt8).order(1),
  });
}
