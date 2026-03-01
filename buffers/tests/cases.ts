namespace Tests {
  const nameLength = 16;
  const person = Buffers.struct({
    name: Buffers.string(nameLength).order(0),
    money: Buffers.float64LE.order(1),
    age: Buffers.uInt8.order(2),
    flags: Buffers.flags({
      admin: 0,
      banned: 1,
    }).order(3),
  });

  testValues({
    encodings: { person },
    values: [
      {
        input: {
          name: "James",
          money: 128.34,
          age: 19,
          flags: {
            admin: true,
            banned: false,
          }
        },
        expected: {
          name: pad("James", nameLength),
          money: 128.34,
          age: 19,
          flags: {
            admin: true,
            banned: false,
          }
        },
      },
      {
        input: {
          name: "John",
          money: -342.02,
          age: 23,
          flags: { admin: true, banned: false },
        },
        expected: {
          name: pad("John", nameLength),
          money: -342.02,
          age: 23,
          flags: { admin: true, banned: false },
        }
      }
    ],
  });
}
