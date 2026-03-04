namespace Radiostack {
  export interface Layer {
    onReceivedBuffer(cb: (buffer: Buffer) => void): void;
    sendBuffer(buffer: Buffer): void;
  }

  export const radio: Layer = {
    onReceivedBuffer: globalThis.radio.onReceivedBuffer,
    sendBuffer: globalThis.radio.sendBuffer,
  };
}
