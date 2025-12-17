namespace Buffers {
  type Field<
    K extends string = string,
    T extends Encoding<any> = Encoding<any>
  > = readonly [K, T];

  /**
  * Represents an encoding mapped to a string key
  * @param key the key to map the given encoding to
  * @param encoding the encoding to map to the given key
  * @returns a tuple containing the key and it's corresponding encoding
  */
  export function field<K extends string, T extends Encoding<any>>(key: K, encoding: T): Field<K, T> {
    return [key, encoding] as const;
  }

  type StructToObject<T extends Field[]> = T extends [] ? { [K: string]: never } : {
    [F in T[number]as F[0]]: F[1] extends Encoding<infer U> ? U : never;
  };

  class StructEncoding<T extends Field[]> extends Encoding<StructToObject<T>> {
    public readonly zero = {} as StructToObject<T>;
    private readonly fields: T;

    constructor(fields: T) {
      super();
      this.fields = fields;
      for (let i = 0; i < this.fields.length; i++) {
        this.zero[this.fields[i][0]] = this.fields[i][1].zero;
      }
    }

    encodeAt(buffer: Buffer, offset: number, value: StructToObject<T>): number {
      let written = 0;
      for (let i = 0; i < this.fields.length; i++) {
        const [key, encoding] = this.fields[i];
        const attribute = value[key as keyof StructToObject<T>];
        written += encoding.encodeAt(buffer, offset + written, attribute);
      }
      return written;
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<StructToObject<T>> {
      const value = {} as StructToObject<T>;
      let read = 0;
      for (let i = 0; i < this.fields.length; i++) {
        const [key, encoding] = this.fields[i];
        const result = encoding.decodeAt(buffer, offset + read);
        value[key as keyof StructToObject<T>] = result.value;
        read += result.read;
      }
      return { value, read };
    }

    measure(value: StructToObject<T>): number {
      let size = 0;
      for (let i = 0; i < this.fields.length; i++) {
        const [key, encoding] = this.fields[i];
        size += encoding.measure(value[key as keyof StructToObject<T>]);
      }
      return size;
    }
  }

  /**
  * Encodes and object-like struct into binary. Fields are encoded
  * in the order they're passed into `struct`.
  * Format: (field0, field1, field2, ...fields)
  */
  export function struct<T extends Field[]>(...fields: T) {
    return new StructEncoding(fields);
  }
}
