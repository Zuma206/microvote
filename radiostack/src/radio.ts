namespace Radiostack {
  export interface Layer {
    onReceivedBuffer(cb: (receivedBuffer: Buffer) => void): void;
    sendBuffer(msg: Buffer): void;
  }

  export const uBitRadio: Layer = {
    onReceivedBuffer: radio.onReceivedBuffer,
    sendBuffer: radio.sendBuffer,
  };

  export const RADIO_MAX_BUFFER_SIZE = 19;
}
