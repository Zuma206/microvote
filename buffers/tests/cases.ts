namespace Tests {
  // Test number encodings with expected ranges
  const n = 30000;
  encodingsTests({ uInt8BE: Buffers.uInt8BE, uInt8LE: Buffers.uInt8LE }, range(0, 255));
  encodingsTests({ int8LE: Buffers.int8LE, int8BE: Buffers.int8BE }, range(-128, 127));
  encodingsTests({ uInt16BE: Buffers.uInt16BE, uInt16LE: Buffers.uInt16LE }, range(0, 65535));
  encodingsTests({ int16LE: Buffers.int16LE, int16BE: Buffers.int16BE }, range(-32768, 32767));
  // Number ranges become too large to test all, so test random selection
  encodingsTests({ uInt32LE: Buffers.uInt32LE, uInt32BE: Buffers.uInt32BE }, randIntRange(0, 4294967295, n));
  encodingsTests({ int32LE: Buffers.int32LE, int32BE: Buffers.int32BE }, randIntRange(-2147483648, 2147483647, n));
  // TODO: add test cases for float encodings
}
