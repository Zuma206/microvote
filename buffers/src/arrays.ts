namespace Buffers {
  class ArrayEncoding<T> extends Encoding<T[]> {
    constructor(
      private readonly valueEncoding: Encoding<T>,
      private readonly lengthEncoding: Encoding<number> = Int32LE
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
  * @param valueEncoding the encoding to encode the array's values with
  * @param lengthEncoding the encoding to encode the array's length with
  */
  export function array<T>(valueEncoding: Encoding<T>, lengthEncoding?: Encoding<number>) {
    return new ArrayEncoding(valueEncoding, lengthEncoding);
  }
}
