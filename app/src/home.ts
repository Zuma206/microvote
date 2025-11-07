import { Microbit } from "./microbit";
import { setupTemplate } from "./setup";
import { show } from "./utils";

export function homeTemplate(root: HTMLElement) {
  const template = document.createElement("template");
  template.innerHTML = `
    <h1>Micovote Web App</h1>
    <button id="connect">Connect to the host Micro:Bit</button>
  `;

  template.content.getElementById("connect").onclick = async function() {
    const microbit = await Microbit.request();
    show(root, setupTemplate(root, microbit));
  }

  return template;
}
