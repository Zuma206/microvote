namespace Buffers {
  /**
  * Wraps the micro:bit's `NumberFormat` enums to fit `Encoding<number>`
  */
  class NumberEncoding extends Encoding<number> {
    private readonly byteSize: number;

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
  export const UInt8BE = new NumberEncoding(NumberFormat.UInt8BE, 8);
  export const UInt8LE = new NumberEncoding(NumberFormat.UInt8LE, 8);
  export const UInt16BE = new NumberEncoding(NumberFormat.UInt16BE, 16);
  export const UInt16LE = new NumberEncoding(NumberFormat.UInt16LE, 16);
  export const UInt32BE = new NumberEncoding(NumberFormat.UInt32BE, 32);
  export const UInt32LE = new NumberEncoding(NumberFormat.UInt32LE, 32);
  export const Int8BE = new NumberEncoding(NumberFormat.Int8BE, 8);
  export const Int8LE = new NumberEncoding(NumberFormat.Int8LE, 8);
  export const Int16BE = new NumberEncoding(NumberFormat.Int16BE, 16);
  export const Int16LE = new NumberEncoding(NumberFormat.Int16LE, 16);
  export const Int32BE = new NumberEncoding(NumberFormat.Int32BE, 32);
  export const Int32LE = new NumberEncoding(NumberFormat.Int32LE, 32);
  export const Float32BE = new NumberEncoding(NumberFormat.Float32BE, 32);
  export const Float32LE = new NumberEncoding(NumberFormat.Float32LE, 32);
  export const Float64BE = new NumberEncoding(NumberFormat.Float64BE, 64);
  export const Float64LE = new NumberEncoding(NumberFormat.Float64LE, 64);
}
