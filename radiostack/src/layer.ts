namespace Radiostack {
  export interface Layer {
    onReceivedBuffer(cb: (buffer: Buffer) => void): void;
    sendBuffer(buffer: Buffer): void;
  }
}
