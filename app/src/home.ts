import { USB_PID, USB_VID } from "./microbit";

export function homeTemplate() {
  const template = document.createElement("template");
  template.innerHTML = `
    <h1>Micovote Web App</h1>
    <button id="connect">Connect to the host Micro:Bit</button>
  `;
  template.content.getElementById("connect").onclick = connect;
  return template;
}

async function connect() {
  const microbit = await requestMicrobit();
}

function requestMicrobit() {
  return navigator.serial.requestPort({
    filters: [{
      usbProductId: USB_PID,
      usbVendorId: USB_VID,
    }]
  });
}
