namespace Buffers {
  class ArrayEncoding<T> extends Encoding<T[]> {
    constructor(
      private readonly encoding: Encoding<T>,
      private readonly length: number,
      private readonly zero: T,
    ) {
      super();
    }

    encodeAt(buffer: Buffer, offset: number, value: T[]): number {
      let written = 0;
      for (let i = 0; i < this.length; i++) {
        const item = i >= value.length ? this.zero : value[i];
        written += this.encoding.encodeAt(buffer, offset + written, item);
      }
      return written;
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<T[]> {
      const value: T[] = [];
      let read = 0;
      for (let i = 0; i < this.length; i++) {
        const result = this.encoding.decodeAt(buffer, offset + read);
        value.push(result.value);
        read += result.read;
      }
      return { value, read };
    }

    measure(value: T[]): number {
      let size = 0;
      for (let i = 0; i < value.length; i++) {
        size += this.encoding.measure(value[i]);
      }
      return size;
    }
  }

  /**
   * Returns an encoding for a fixed-length array of `T`.
   * Format: (value0, value1, ...values)
   * @param encoding the encoding to use for elements
   * @param length the length of the array
   * @param zero the value to fill with if the provided array is too short
   */
  export function array<T>(encoding: Encoding<T>, length: number, zero: T) {
    return new ArrayEncoding(encoding, length, zero);
  }
}
