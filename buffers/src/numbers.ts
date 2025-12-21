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
  // No endianness for single byte (8-bit) types to avoid confusion
  export const uInt8 = numberEncoding(NumberFormat.UInt8LE, 8);
  export const uInt16BE = numberEncoding(NumberFormat.UInt16BE, 16);
  export const uInt16LE = numberEncoding(NumberFormat.UInt16LE, 16);
  export const uInt32BE = numberEncoding(NumberFormat.UInt32BE, 32);
  export const uInt32LE = numberEncoding(NumberFormat.UInt32LE, 32);
  export const int8 = numberEncoding(NumberFormat.Int8LE, 8);
  export const int16BE = numberEncoding(NumberFormat.Int16BE, 16);
  export const int16LE = numberEncoding(NumberFormat.Int16LE, 16);
  export const int32BE = numberEncoding(NumberFormat.Int32BE, 32);
  export const int32LE = numberEncoding(NumberFormat.Int32LE, 32);
  export const float32BE = numberEncoding(NumberFormat.Float32BE, 32);
  export const float32LE = numberEncoding(NumberFormat.Float32LE, 32);
  export const float64BE = numberEncoding(NumberFormat.Float64BE, 64);
  export const float64LE = numberEncoding(NumberFormat.Float64LE, 64);
}
