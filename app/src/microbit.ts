// The baud rate that the Micro:Bit uses
// Source: https://makecode.microbit.org/device/serial
const BAUD_RATE = 115200;

// The Micro:Bit USB vendor ID
// Source: https://support.microbit.org/support/solutions/articles/19000035697-what-are-the-usb-vid-pid-numbers-for-micro-bit
const USB_PID = 0x0204;

// The Micro:Bit USB product ID
// Source: https://support.microbit.org/support/solutions/articles/19000035697-what-are-the-usb-vid-pid-numbers-for-micro-bit
const USB_VID = 0x0d28;

export class Microbit {
  static async request() {
    const port = await navigator.serial.requestPort({
      filters: [{ usbProductId: USB_PID, usbVendorId: USB_VID }]
    });
    return new this(port);
  }

  constructor(private readonly port: SerialPort) { }

  async open() {
    await this.port.open({ baudRate: BAUD_RATE });
    this.reader = this.port.readable.getReader();
    this.writer = this.port.writable.getWriter();
  }

  private writer?: WritableStreamDefaultWriter<Uint8Array<ArrayBufferLike>>;
  private reader?: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>;
  private readonly textDecoder = new TextDecoder("utf8");
  private readonly textEncoder = new TextEncoder();
  private textBuffer = "";

  async readLine() {
    if (!this.reader) throw new Error("micro:bit read before being opened");
    while (!this.textBuffer.includes("\n")) {
      const { value, done } = await this.reader.read();
      if (done) throw new Error("stream ended prematurely");
      this.textBuffer += this.textDecoder.decode(value);
    }
    const [line, leftover] = this.textBuffer.split("\n", 2);
    this.textBuffer = leftover;
    return line;
  }

  async writeLine(text: string) {
    if (!this.reader) throw new Error("micro:bit written to before being opened");
    await this.writer.write(this.textEncoder.encode(text + "\n"));
  }
}
