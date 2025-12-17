namespace Buffers {
  /**
  * The result of running `.decodeAt` on an `Encoding<T>`
  */
  export interface DecodeAtResult<T> {
    read: number;
    value: T;
  }

  export interface EncodingWithOrder<T> {
    encoding: EncodingImpl<T>;
    order: number;
  }

  export interface EncodingImpl<T> {
    encodeAt(buffer: Buffer, offset: number, value: T): number;
    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<T>;
    measure(value: T): number;
    readonly zero: T;
  }

  /**
  * An object capable of encoding and decoding `T` into binary using a given encoding
  */
  export class Encoding<T> implements EncodingImpl<T> {
    constructor(private readonly impl: EncodingImpl<T>) { }

    /**
    * Encodes a value into a buffer at an offset
    * @param buffer the buffer to encode into
    * @param offset the offset to encode at
    * @param value the value to encode
    * @returns the number of bytes written
    */
    encodeAt(buffer: Buffer, offset: number, value: T): number {
      return this.impl.encodeAt(buffer, offset, value);
    }

    /**
    * Decodes a value from a buffer at an offset
    * @param buffer the buffer to decode from
    * @param offset the offset to decode at
    */
    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<T> {
      return this.impl.decodeAt(buffer, offset);
    }

    /**
    * Measures the size of a value once encoded 
    * @param value the value to measure
    * @returns the size (in bytes) the value will be once encoded
    */
    measure(value: T): number {
      return this.impl.measure(value);
    }

    /**
    * A default/zero value for the encoded type
    */
    get zero() {
      return this.impl.zero;
    }

    /**
    * Decodes a buffer into a value
    * @param buffer the buffer containing the binary encoding of a value
    * @returns the value that was encoded into the buffer
    */
    decode(buffer: Buffer) {
      return this.impl.decodeAt(buffer, 0);
    }

    /**
    * Encodes a value into a buffer
    * @param value the value to encode
    * @returns a buffer containing a binary representation of the value
    */
    encode(value: T) {
      const size = this.impl.measure(value);
      const buffer = pins.createBuffer(size);
      return this.impl.encodeAt(buffer, 0, value);
    }

    /**
    * Attaches an order to the encoding, so that multi-value data structures
    * can encode values in the correct order.
    */
    order(order: number): EncodingWithOrder<T> {
      return { encoding: this.impl, order };
    }
  }
}
