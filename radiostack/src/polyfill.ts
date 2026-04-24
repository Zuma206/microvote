namespace Radiostack {
  // polyfill for the "in" keyword
  export function has<T>(map: { [key: number]: T }, key: number) {
    return map[key] !== undefined;
  }
}
