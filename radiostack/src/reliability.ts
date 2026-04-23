namespace Radiostack {
  export type ReliabilityPacket = typeof ReliabilityPacket.zero;
  export const ReliabilityPacket = Buffers.struct({
    flags: Buffers.flags({ syn: 0, ack: 1, fin: 2 }).order(0),
    message: Buffers.uInt16LE.order(1),
    sequence: Buffers.uInt16LE.order(2),
    chunk: Buffers.buffer(Buffers.uInt8).order(3),
  });

  export const ACK_TIMEOUT = 150,
    RELIABILITY_RETRIES = 5;
}
