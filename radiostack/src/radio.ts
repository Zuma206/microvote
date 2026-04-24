namespace Radiostack {
  export interface SendBufferOptions {
    onSuccess?: () => void,
    onFailure?: () => void,
    msg: Buffer;
  }

  export interface Layer {
    onReceivedBuffer(cb: (receivedBuffer: Buffer) => void): void;
    sendBuffer(options: SendBufferOptions): void;
  }

  export const uBitRadio: Layer = {
    onReceivedBuffer: (cb) => radio.onReceivedBuffer(cb),
    sendBuffer: (options: SendBufferOptions) => {
      radio.sendBuffer(options.msg);
      if (options.onSuccess !== undefined)
        options.onSuccess();
    }
  };

  export const RADIO_MAX_BUFFER_SIZE = 19;
}
