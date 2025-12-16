namespace Buffers {
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
}
