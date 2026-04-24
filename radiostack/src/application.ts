namespace Radiostack {
  export type ApplicationPacket = typeof ApplicationPacket.zero;
  export const ApplicationPacket = Buffers.struct({
    flags: Buffers.flags({ start: 0, identify: 1, pair: 2 }).order(0),
    id: Buffers.uInt32.order(1),
    n: Buffers.uInt8.order(2),
  });
}
