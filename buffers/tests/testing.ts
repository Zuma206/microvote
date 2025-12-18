namespace Tests {
  function assertDeepEqual<T>(name: string, value: T, expected: T) {
    control.assert(typeof value == typeof expected,
      `${name} was of type ${typeof value}, type of ${typeof expected} was expected`);
    if (typeof value == "object" && value != null) {
      const keys = Object.keys(value).concat(Object.keys(expected));
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i] as keyof typeof value & keyof typeof expected & string;
        assertDeepEqual(`${name}.${key}`, value[key], expected[key]);
      }
    } else {
      control.assert(value == expected,
        `${name} was ${value}, expected ${expected}`);
    }
  }

  export function testEncoding<T>(name: string, encoding: Buffers.Encoding<T>, value: T) {
    const buffer = encoding.encode(value);
    const result = encoding.decode(buffer);
    assertDeepEqual(name, value, result);
  }

  export function encodingTests<T>(name: string, encoding: Buffers.Encoding<T>, values: T[]) {
    for (let i = 0; i < values.length; i++) {
      testEncoding(name, encoding, values[i]);
    }
  }

  export function range(first: number, last: number, percent = 1) {
    const numbers: number[] = [];
    for (let i = first; i <= last; i += 1 / percent)
      numbers.push(i);
    return numbers;
  }

  export function encodingsTests<T>(encodings: { [K: string]: Buffers.Encoding<any> }, values: T[]) {
    const keys = Object.keys(encodings);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      encodingTests(key, encodings[key], values);
    }
  }

  export function randIntRange(min: number, max: number, length: number) {
    const numbers = [min, max];
    while (numbers.length < length) {
      numbers.push(Math.randomRange(min + 1, max - 1));
    }
    return numbers;
  }

  export function randFloatRange(min: number, max: number, length: number) {
    const numbers = [min, max];
    while (numbers.length < length) {
      const whole = Math.randomRange(min + 1, max - 1);
      const fraction = Math.min(Math.random(), 0.9999999999999999);
      numbers.push(whole + fraction);
    }
    return numbers;
  }
}
