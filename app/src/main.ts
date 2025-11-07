import { homeTemplate } from "./home";
import * as microbit from "./microbit";

const textDecoder = new TextDecoder();

async function main() {
  const port = await navigator.serial.requestPort({
    filters: [{ usbVendorId: microbit.USB_VID, usbProductId: microbit.USB_PID }],
  });
  console.log("Connected to:", port.getInfo());
  await port.open({ baudRate: microbit.BAUD_RATE });
  const reader = port.readable.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log(textDecoder.decode(value));
  }
}

const root = document.getElementById("root");
root.appendChild(homeTemplate().content);
