namespace Buffers {
  class BufferEncoding extends Encoding<Buffer> {
    constructor(private readonly lengthEncoding: Encoding<number> = UInt32LE) {
      super();
    }

    encodeAt(buffer: Buffer, offset: number, value: Buffer): number {
      const lengthWritten = this.lengthEncoding.encodeAt(buffer, offset, value.length);
      for (let i = 0; i < lengthWritten; i++) {
        const byteOffset = offset + lengthWritten + i;
        buffer.setUint8(byteOffset, value.getUint8(i));
      }
      return lengthWritten + value.length;
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<Buffer> {
      const { value: length, read } = this.lengthEncoding.decodeAt(buffer, offset);
      const value = buffer.slice(offset + read, length);
      return { value, read: read + value.length };
    }

    measure(value: Buffer): number {
      return this.lengthEncoding.measure(value.length) + value.length;
    }
  }

  /**
  * Encoding a buffer and it's length using a given length encoding
  * Format: (length, ...buffer)
  * @param lengthEncoding the encoding to write the length with
  */
  export function buffer(lengthEncoding?: Encoding<number>) {
    return new BufferEncoding(lengthEncoding);
  }
}
