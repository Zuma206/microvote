namespace Buffers {
  type StructSchema = {
    [K: string]: EncodingWithOrder<any>;
  };

  type StructToObject<T extends StructSchema> = {
    [K in keyof T]: T[K]["encoding"]["zero"];
  }

  type StructField = { key: string, encoding: EncodingWithOrder<any> };

  function sortStrings(a: string, b: string) {
    for (let i = 0; i < a.length && i < b.length; i++) {
      const charA = a.charCodeAt(i), charB = b.charCodeAt(i);
      if (charA < charB) return -1;
      if (charA > charB) return 1;
    }
    return 0;
  }

  function sortStructFields(a: StructField, b: StructField) {
    if (a.encoding.order < b.encoding.order) return -1;
    else if (a.encoding.order > b.encoding.order) return 1;
    return sortStrings(a.key, b.key);
  }

  class StructEncoding<T extends StructSchema> implements EncodingImpl<StructToObject<T>> {
    public readonly zero = {} as StructToObject<T>;
    private readonly fields: StructField[];

    constructor(structSchema: T) {
      this.fields = Object.keys(structSchema)
        .map((key) => ({ key, encoding: structSchema[key] }))
        .sort(sortStructFields);
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i];
        this.zero[field.key as keyof StructToObject<T>] = field.encoding.encoding.zero;
      }
    }

    encodeAt(buffer: Buffer, offset: number, value: StructToObject<T>): number {
      let written = 0;
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i];
        const attribute = value[field.key as keyof StructToObject<T>];
        written += field.encoding.encoding.encodeAt(buffer, offset + written, attribute);
      }
      return written;
    }

    decodeAt(buffer: Buffer, offset: number): DecodeAtResult<StructToObject<T>> {
      const value = {} as StructToObject<T>;
      let read = 0;
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i];
        const result = field.encoding.encoding.decodeAt(buffer, offset + read);
        value[field.key as keyof StructToObject<T>] = result.value;
        read += result.read;
      }
      return { value, read };
    }

    measure(value: StructToObject<T>): number {
      let size = 0;
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i];
        size += field.encoding.encoding.measure(value[field.key as keyof StructToObject<T>]);
      }
      return size;
    }
  }

  /**
  * Encodes and object-like struct into binary. Fields are encoded
  * in the order they're passed into `struct`.
  * Format: (field0, field1, field2, ...fields)
  */
  export function struct<T extends StructSchema>(structSchema: T) {
    return new StructEncoding(structSchema);
  }
}
