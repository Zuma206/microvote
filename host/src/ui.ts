function renderResults(results: number[]) {
  const total = results.reduce((prev, curr) => prev + curr, 0);
  basic.showNumber(total);
}
