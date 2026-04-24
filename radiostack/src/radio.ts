namespace Radiostack {
  export interface Layer {
    onReceivedBuffer(cb: (receivedBuffer: Buffer) => void): void;
    sendBuffer(buffer: Buffer): void;
  }

  export const uBitRadio: Layer = {
    onReceivedBuffer: (cb) => radio.onReceivedBuffer(cb),
    sendBuffer: (buffer: Buffer) => radio.sendBuffer(buffer),
  };

  export const RADIO_MAX_BUFFER_SIZE = 19;
}
