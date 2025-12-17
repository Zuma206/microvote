namespace Buffers {
  type FlagToObject<T extends string[]> = {
    [K in T[number]]?: boolean;
  }

  class FlagEncoding<T extends string[]> extends Encoding<FlagToObject<T>> {
    private static readonly encoding = uInt8LE;

    constructor(private readonly flags: T) {
      super();
      if (flags.length > 8) {
        throw `exceeded max flags (8) with ${flags.length}`;
      }
    }

    encodeAt(buffer: Buffer, offset: number, value: FlagToObject<T>): number {
      let flags = 0;
      for (let i = 0; i < this.flags.length; i++) {
        const mask = Math.pow(2, i);
        const enabled = value[this.flags[i] as keyof FlagToObject<T>] == true;
        flags |= enabled ? mask : 0;
      }
      return FlagEncoding.encoding.encodeAt(buffer, offset, flags);
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<FlagToObject<T>> {
      const { value: flags, read } = FlagEncoding.encoding.decodeAt(buffer, offset);
      const value = {} as FlagToObject<T>;
      for (let i = 0; i < this.flags.length; i++) {
        const mask = Math.pow(2, i);
        const enabled = (flags & mask) == mask;
        value[this.flags[i] as keyof FlagToObject<T>] = enabled;
      }
      return { value, read };
    }

    measure(_: FlagToObject<T>): number {
      return FlagEncoding.encoding.measure(0);
    }
  }

  /**
  * Encodes of up to 8 string flags into a single byte
  */
  export function flags<T extends string[]>(...flags: T) {
    return new FlagEncoding(flags);
  }
}
