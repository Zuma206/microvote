namespace Buffers {
  type FlagsSchema = {
    [K: string]: number;
  }

  type FlagsToObject<T extends FlagsSchema> = {
    [K in keyof T]?: boolean;
  }

  type Flag = { key: string, order: number };

  function sortStrings(a: string, b: string) {
    for (let i = 0; i < a.length && i < b.length; i++) {
      const charA = a.charCodeAt(i), charB = b.charCodeAt(i);
      if (charA < charB) return -1;
      else if (charA > charB) return 1;
    }
    return 0;
  }

  function sortFlags(a: Flag, b: Flag) {
    if (a.order < b.order) return -1;
    else if (a.order > b.order) return 1;
    return sortStrings(a.key, b.key);
  }

  class FlagEncoding<T extends FlagsSchema> implements EncodingImpl<FlagsToObject<T>> {
    public readonly zero: FlagsToObject<T> = {};
    private readonly encoding = uInt8;
    private readonly flagsPerByte = 8;
    private readonly flags: Flag[];
    private readonly bytes: number;

    constructor(flagSchema: T) {
      this.flags = Object.keys(flagSchema)
        .map(key => ({ key, order: flagSchema[key] }))
        .sort(sortFlags);
      this.bytes = Math.ceil(this.flags.length / 8);
    }

    encodeAt(buffer: Buffer, offset: number, value: FlagsToObject<T>): number {
      let written = 0;
      for (let byte = 0; byte < this.bytes; byte++) {
        let flags = 0;
        for (let flagInByte = 0, flag = byte * this.flagsPerByte;
          flag < this.flags.length; flag++, flagInByte++) {
          const mask = 1 << flagInByte;
          const enabled = value[this.flags[flag].key] == true;
          if (enabled) flags |= mask;
        }
        written += this.encoding.encodeAt(buffer, offset + written, flags);
      }
      return written;
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<FlagsToObject<T>> {
      const value = {} as FlagsToObject<T>;
      let read = 0;
      for (let byte = 0; byte < this.bytes; byte++) {
        const result = this.encoding.decodeAt(buffer, offset + read);
        for (let flagInByte = 0, flag = byte * this.flagsPerByte;
          flag < this.flags.length; flagInByte++, flag++) {
          const mask = Math.pow(2, flag);
          const enabled = (result.value & mask) == mask;
          value[this.flags[flag].key as keyof FlagsToObject<T>] = enabled;
        }
        read += result.read;
      }
      return { value, read };
    }

    measure(_: FlagsToObject<T>): number {
      return this.bytes;
    }
  }

  /**
  * Encodes of up to 8 string flags into a single byte
  */
  export function flags<T extends FlagsSchema>(flagsSchema: T) {
    return new Encoding(new FlagEncoding(flagsSchema));
  }
}
