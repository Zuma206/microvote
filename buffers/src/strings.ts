namespace Buffers {
  class CharEncoding implements EncodingImpl<string> {
    public readonly zero: string = "\0";
    private static encoding = uInt8LE;

    encodeAt(buffer: Buffer, offset: number, value: string): number {
      return CharEncoding.encoding.encodeAt(buffer, offset, value.charCodeAt(0));
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<string> {
      const { value, read } = CharEncoding.encoding.decodeAt(buffer, offset);
      return { value: String.fromCharCode(value), read };
    }

    measure(value: string): number {
      return CharEncoding.encoding.measure(value.charCodeAt(0));
    }
  }

  /**
    * Encodes a char (string with length 1) as an ASCII uInt8LE
    */
  export const char = new CharEncoding();

  class StringEncoding implements EncodingImpl<string> {
    private readonly encoding: EncodingImpl<string[]>;
    private static readonly encoding = char;
    public readonly zero: string = "";

    constructor(length: number) {
      this.encoding = array(StringEncoding.encoding, length);
    }

    encodeAt(buffer: Buffer, offset: number, value: string): number {
      return this.encoding.encodeAt(buffer, offset, value.split(""));
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<string> {
      const { value, read } = this.encoding.decodeAt(buffer, offset);
      return { value: value.join(""), read };
    }

    measure(value: string): number {
      return this.encoding.measure(value.split(""));
    }
  }

  /**
   * Encoding for a fixed-length string. Wrapper of an array of characters using `.split()` and `.join()`
   * Format: (char, char, char, ...chars)
   * @param length the max-length of the string
   * @param optional padding character for strings smaller than `max-length`, defaults to `'\0'`
   */
  export function string(length: number) {
    return new StringEncoding(length);
  }
}
