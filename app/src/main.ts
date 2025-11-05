// The baud rate that the Micro:Bit uses
// Source: https://makecode.microbit.org/device/serial
const MICROBIT_BAUD_RATE = 115200;

const textDecoder = new TextDecoder();

async function main() {
  const port = await navigator.serial.requestPort();
  console.log("Connected to:", port.getInfo());
  await port.open({ baudRate: MICROBIT_BAUD_RATE });
  const reader = port.readable.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    console.log(textDecoder.decode(value));
  }
}

const button = document.createElement("button");
button.innerText = "Select Device";
document.getElementById("root").append(button);
button.addEventListener("click", main);

