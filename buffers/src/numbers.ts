namespace Buffers {
  /**
  * Wraps the micro:bit's `NumberFormat` enums to fit `Encoding<number>`
  */
  class NumberEncoding extends Encoding<number> {
    private readonly byteSize: number;
    public readonly zero: number = 0;

    constructor(private readonly format: NumberFormat, bitSize: number) {
      super();
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

  // `NumberEncoding` definitions for every one of the micro:bit's `NumberFormat` enums
  export const uInt8BE = new NumberEncoding(NumberFormat.UInt8BE, 8);
  export const uInt8LE = new NumberEncoding(NumberFormat.UInt8LE, 8);
  export const uInt16BE = new NumberEncoding(NumberFormat.UInt16BE, 16);
  export const uInt16LE = new NumberEncoding(NumberFormat.UInt16LE, 16);
  export const uInt32BE = new NumberEncoding(NumberFormat.UInt32BE, 32);
  export const uInt32LE = new NumberEncoding(NumberFormat.UInt32LE, 32);
  export const int8BE = new NumberEncoding(NumberFormat.Int8BE, 8);
  export const int8LE = new NumberEncoding(NumberFormat.Int8LE, 8);
  export const int16BE = new NumberEncoding(NumberFormat.Int16BE, 16);
  export const int16LE = new NumberEncoding(NumberFormat.Int16LE, 16);
  export const int32BE = new NumberEncoding(NumberFormat.Int32BE, 32);
  export const int32LE = new NumberEncoding(NumberFormat.Int32LE, 32);
  export const float32BE = new NumberEncoding(NumberFormat.Float32BE, 32);
  export const float32LE = new NumberEncoding(NumberFormat.Float32LE, 32);
  export const float64BE = new NumberEncoding(NumberFormat.Float64BE, 64);
  export const float64LE = new NumberEncoding(NumberFormat.Float64LE, 64);
}
