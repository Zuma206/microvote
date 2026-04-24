namespace Tests {
  const nameLength = 16;
  const person = Buffers.struct({
    money: Buffers.float64LE.order(0),
    age: Buffers.uInt8.order(1),
    flags: Buffers.flags({
      admin: 0,
      banned: 1,
    }).order(2),
  });

  testValues({
    encodings: { person },
    values: [
      {
        input: {
          money: 128.34,
          age: 19,
          flags: {
            admin: true,
            banned: false,
          },
        },
        expected: {
          money: 128.34,
          age: 19,
          flags: {
            admin: true,
            banned: false,
          },
        },
      },
      {
        input: {
          money: -342.02,
          age: 23,
          flags: { admin: true, banned: false },
        },
        expected: {
          money: -342.02,
          age: 23,
          flags: { admin: true, banned: false },
        }
      }
    ],
  });

  const bufferStruct = Buffers.struct({ buffer: Buffers.buffer().order(0) });
  const numberToEncode = Buffers.int32LE.encode(356);
  const encodedBufferStruct = bufferStruct.encode({ buffer: numberToEncode });
  const decodedBufferStruct = bufferStruct.decode(encodedBufferStruct);
  control.assert(decodedBufferStruct.buffer.equals(numberToEncode), "encoded buffer differed from expected content");
}
