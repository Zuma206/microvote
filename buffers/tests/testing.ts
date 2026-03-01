namespace Tests {
  function assertDeepEqual<T>(name: string, actual: T, expected: T) {
    control.assert(typeof actual == typeof expected,
      `${name} was of type ${typeof actual}, type of ${typeof expected} was expected`);
    if (typeof actual == "object" && actual != null) {
      if (Array.isArray(expected)) {
        control.assert(Array.isArray(actual), `expected ${name} to be array, got plain object`);
        const expectedArr = expected as any as any[];
        const actualArr = actual as any as any[];
        control.assert(expectedArr.length == actualArr.length,
          `expected ${name} to have length ${expectedArr.length}, got length ${actualArr.length}`);
        for (let i = 0; i < expectedArr.length; i++) {
          assertDeepEqual(`${name}[${i}]`, actualArr[i], expectedArr[i]);
        }
      }
      else {
        const keys = Object.keys(actual).concat(Object.keys(expected));
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i] as keyof typeof actual & keyof typeof expected & string;
          assertDeepEqual(`${name}.${key}`, actual[key], expected[key]);
        }
      }
    } else {
      control.assert(actual == expected,
        `${name} was ${actual}, expected ${expected}`);
    }
  }

  type TestValuesOptions<T> = {
    encodings: { [K: string]: Buffers.Encoding<T> };
    values: ({ input: T, expected?: T })[];
  }

  export function testValues<T>(options: TestValuesOptions<T>) {
    const encodingNames = Object.keys(options.encodings);
    for (let i = 0; i < encodingNames.length; i++) {
      const encodingName = encodingNames[i];
      const encoding = options.encodings[encodingName];
      for (let j = 0; j < options.values.length; j++) {
        const value = options.values[j];
        const buffer = encoding.encode(value.input);
        const actual = encoding.decode(buffer);
        const expected = value.expected !== undefined
          ? value.expected
          : value.input;
        assertDeepEqual(encodingName, actual, expected);
      }
    }
  }

  export function pad(str: string, len: number) {
    while (str.length < len) {
      str += "\0";
    }
    return str;
  }
}
