namespace Buffers {
  class BufferEncoding implements EncodingImpl<Buffer> {
    private readonly lengthEncoding: EncodingImpl<number>;
    public readonly zero: Buffer = pins.createBuffer(0);

    constructor(lengthEncoding?: EncodingImpl<number>) {
      if (lengthEncoding)
        this.lengthEncoding = lengthEncoding;
      else
        this.lengthEncoding = uInt32LE;
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
  * Encoding a buffer and it's length using a given length encoding,
  * which is uInt32LE by default.
  * Format: (length, ...buffer)
  * @param lengthEncoding the encoding to write the length with
  */
  export function buffer(lengthEncoding?: EncodingImpl<number>) {
    return new Encoding(new BufferEncoding(lengthEncoding));
  }
}
