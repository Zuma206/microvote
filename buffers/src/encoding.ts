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

  /**
  * An object capable of encoding and decoding `T` into binary using a given encoding
  */
  export interface EncodingImpl<T> {
    /**
    * Encodes a value into a buffer at an offset
    * @param buffer the buffer to encode into
    * @param offset the offset to encode at
    * @param value the value to encode
    * @returns the number of bytes written
    */
    encodeAt(buffer: Buffer, offset: number, value: T): number;

    /**
    * Decodes a value from a buffer at an offset
    * @param buffer the buffer to decode from
    * @param offset the offset to decode at
    */
    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<T>;

    /**
    * Measures the size of a value once encoded 
    * @param value the value to measure
    * @returns the size (in bytes) the value will be once encoded
    */
    measure(value: T): number;

    /**
    * A default/zero value for the encoded type
    */
    readonly zero: T;
  }
}
