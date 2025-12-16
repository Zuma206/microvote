namespace Buffers {
  class ArrayEncoding<T> extends Encoding<T[]> {
    constructor(
      private readonly valueEncoding: Encoding<T>,
      private readonly lengthEncoding: Encoding<number> = UInt32LE
    ) {
      super();
    }

    encodeAt(buffer: Buffer, offset: number, value: T[]): number {
      let written = this.lengthEncoding.encodeAt(buffer, offset, value.length);
      for (let i = 0; i < value.length; i++) {
        written += this.valueEncoding.encodeAt(buffer, offset + written, value[i]);
      }
      return written;
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<T[]> {
      let { value: length, read } = this.lengthEncoding.decodeAt(buffer, offset);
      const value: T[] = [];
      for (let i = 0; i < length; i++) {
        const result = this.valueEncoding.decodeAt(buffer, offset + read);
        value.push(result.value);
        read += result.read;
      }
      return { value, read };
    }

    measure(value: T[]): number {
      let size = this.lengthEncoding.measure(value.length);
      for (let i = 0; i < value.length; i++) {
        size += this.valueEncoding.measure(value[i]);
      }
      return size;
    }
  }

  /**
  * Returns an encoding for an array of `T`
  * Format: (length, ...values)
  * @param valueEncoding the encoding to encode the array's values with
  * @param lengthEncoding the encoding to encode the array's length with
  */
  export function array<T>(valueEncoding: Encoding<T>, lengthEncoding?: Encoding<number>) {
    return new ArrayEncoding(valueEncoding, lengthEncoding);
  }
}
