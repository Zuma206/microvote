namespace Tests {
  function assertDeepEqual<T>(name: string, actual: T, expected: T) {
    control.assert(typeof actual == typeof expected,
      `${name} was of type ${typeof actual}, type of ${typeof expected} was expected`);
    if (typeof actual == "object" && actual != null) {
      const keys = Object.keys(actual).concat(Object.keys(expected));
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof typeof actual & keyof typeof expected & string;
        assertDeepEqual(`${name}.${key}`, actual[key], expected[key]);
      }
    } else {
      control.assert(actual == expected,
        `${name} was ${actual}, expected ${expected}`);
    }
  }

  type TestValuesOptions<T> = {
    encodings: { [K: string]: Buffers.Encoding<T> };
    toExpected?: (value: T) => T;
    values: T[];
  }

  export function testValues<T>(options: TestValuesOptions<T>) {
    const encodingNames = Object.keys(options.encodings);
    for (let i = 0; i < encodingNames.length; i++) {
      const encodingName = encodingNames[i];
      const encoding = options.encodings[encodingName];
      for (let j = 0; j < options.values.length; j++) {
        const value = options.values[j];
        const buffer = encoding.encode(value);
        const expected = options.toExpected ? options.toExpected(value) : value;
        const actual = encoding.decode(buffer);
        assertDeepEqual(encodingName, actual, expected);
      }
    }
  }
}
