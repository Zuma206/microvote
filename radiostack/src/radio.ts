namespace Radiostack {
  export interface Layer {
    onReceivedBuffer(cb: (receivedBuffer: Buffer) => void): void;
    sendBuffer(msg: Buffer): void;
  }

  export const uBitRadio: Layer = {
    onReceivedBuffer: radio.onReceivedBuffer,
    sendBuffer: radio.sendBuffer,
  };
}
