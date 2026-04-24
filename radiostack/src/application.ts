namespace Radiostack {
  export enum ApplicationPacketType {
    Start,
    Pair,
    Cast,
  }

  export type ApplicationPacket = typeof ApplicationPacket.zero;
  export const ApplicationPacket = Buffers.struct({
    type: Buffers.uInt8.order(0),
    id: Buffers.uInt32.order(1),
    n: Buffers.uInt8.order(2),
  });
}
