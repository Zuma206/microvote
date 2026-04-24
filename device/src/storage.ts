class Storage<T> {
  constructor(private readonly key: string, private readonly value: T) { }

  set(value: T) {
    flashstorage.put(this.key, JSON.stringify(value));
  }

  get() {
    const value = flashstorage.get(this.key);
    if (value === "") return this.value;
    return JSON.parse(value) as T;
  }
}
