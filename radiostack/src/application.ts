namespace Radiostack {
  export const ApplicationPacket = Buffers.struct({
    flags: Buffers.flags({ start: 0, cast: 1 }).order(0),
    parameter: Buffers.uInt8.order(1),
  });
}
