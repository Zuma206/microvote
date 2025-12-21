namespace Tests {
  function range(min: number, max: number, step: number) {
    const numbers: number[] = [];
    for (let i = min; i <= max; i += step) {
      numbers.push(i);
    }
    return numbers;
  }

  function limits(limits: number[]) {
    const numbers: number[] = [];
    for (let i = 0; i < limits.length; i++) {
      const limit = limits[i];
      numbers.push(-limit - 1);
      numbers.push(-limit);
      numbers.push(limit);
      numbers.push(limit + 1);
    }
    return numbers;
  }

  const TEST_NUMBERS = [
    ...limits([
      1.7E308, // Float32
    ]),
    ...range(-50000, 50000, 1000),
  ];
}
