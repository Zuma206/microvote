namespace Tests {
  const person = Buffers.struct({
    age: Buffers.uInt8.order(1),
  });

  testValues({
    encodings: { person },
    values: [
      {
        input: {
          age: 19,
        },
        expected: {
          age: 19,
        },
      },
      {
        input: {
          age: 23,
        },
        expected: {
          age: 23,
        }
      }
    ],
  });

  const bufferStruct = Buffers.struct({ buffer: Buffers.buffer().order(0) });
  const numberToEncode = Buffers.uInt32.encode(356);
  const encodedBufferStruct = bufferStruct.encode({ buffer: numberToEncode });
  const decodedBufferStruct = bufferStruct.decode(encodedBufferStruct);
  control.assert(decodedBufferStruct.buffer.equals(numberToEncode), "encoded buffer differed from expected content");
}
