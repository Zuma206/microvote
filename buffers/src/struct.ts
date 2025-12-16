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
}
