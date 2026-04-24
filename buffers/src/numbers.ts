namespace Buffers {
  /**
  * Wraps the micro:bit's `NumberFormat` enums to fit `Encoding<number>`
  */
  class NumberEncoding implements EncodingImpl<number> {
    private readonly byteSize: number;
    public readonly zero: number = 0;

    constructor(private readonly format: NumberFormat, bitSize: number) {
      this.byteSize = bitSize / 8;
    }

    encodeAt(buffer: Buffer, offset: number, value: number): number {
      buffer.setNumber(this.format, offset, value);
      return this.byteSize;
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<number> {
      const value = buffer.getNumber(this.format, offset);
      return { value, read: this.byteSize };
    }

    measure(_: number): number {
      return this.byteSize;
    }
  }

  function numberEncoding(format: NumberFormat, bitSize: number) {
    return new Encoding(new NumberEncoding(format, bitSize));
  }

  // NumberEncoding definitions for every one of the micro:bit's NumberFormat enums
  export const uInt8 = numberEncoding(NumberFormat.UInt8LE, 8);
  export const uInt16 = numberEncoding(NumberFormat.UInt16LE, 16);
  export const uInt32 = numberEncoding(NumberFormat.UInt32LE, 32);
}
