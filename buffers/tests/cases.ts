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
    friends: Buffers.array(Buffers.uInt32BE, 3).order(4)
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
          },
          friends: [4, 2],
        },
        expected: {
          name: pad("James", nameLength),
          money: 128.34,
          age: 19,
          flags: {
            admin: true,
            banned: false,
          },
          friends: [4, 2, 0]
        },
      },
      {
        input: {
          name: "John",
          money: -342.02,
          age: 23,
          flags: { admin: true, banned: false },
          friends: [4672, 3692, 356578],
        },
        expected: {
          name: pad("John", nameLength),
          money: -342.02,
          age: 23,
          flags: { admin: true, banned: false },
          friends: [4672, 3692, 356578]
        }
      }
    ],
  });
}
