namespace Radiostack {
  export interface Layer {
    onReceivedBuffer(cb: (buffer: Buffer) => void): void;
    sendBuffer(buffer: Buffer): void;
  }

  export const ubitRadio: Layer = {
    onReceivedBuffer: radio.onReceivedBuffer,
    sendBuffer: radio.sendBuffer,
  };
}
