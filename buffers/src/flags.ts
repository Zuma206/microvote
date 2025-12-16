namespace Buffers {
  type MaxLenArray<
    T,
    N extends number,
    R extends T[] = []
  > = R['length'] extends N ? R : R | MaxLenArray<T, N, [...R, T]>;

  type FlagKeys = MaxLenArray<string, 8>;

  type FlagToObject<T extends FlagKeys> = {
    [K in T[number]]?: boolean;
  }

  class FlagEncoding<T extends FlagKeys> extends Encoding<FlagToObject<T>> {
    private static readonly encoding = uInt8LE;

    constructor(private readonly flags: T) {
      super();
    }

    encodeAt(buffer: Buffer, offset: number, value: FlagToObject<T>): number {
      let flags = 0;
      for (let i = 0; i < this.flags.length; i++) {
        const mask = Math.pow(2, i);
        const enabled = value[this.flags[i] as keyof FlagToObject<T>] == true;
        flags &= enabled ? mask : 0;
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
  export function flags<T extends FlagKeys>(...flags: T) {
    return new FlagEncoding(flags);
  }
}
